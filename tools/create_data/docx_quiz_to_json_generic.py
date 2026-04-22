#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path
from zipfile import ZipFile

from docx import Document

NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "v": "urn:schemas-microsoft-com:vml",
}


def normalize_text(value: str) -> str:
    value = (value or "").replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def flag_to_bool(value: str):
    v = normalize_text(value).upper()
    if v == "V":
        return True
    if v == "F":
        return False
    return None


def extension_from_content_type(content_type: str) -> str:
    mapping = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
        "image/x-emf": ".emf",
        "image/x-wmf": ".wmf",
        "image/svg+xml": ".svg",
    }
    return mapping.get(content_type, ".bin")


def extract_image_from_rel(rid: str, doc_part, images_dir: Path):
    rel = doc_part.rels.get(rid)
    if rel is None or not hasattr(rel, "target_part"):
        return None

    target_part = rel.target_part
    partname = str(target_part.partname).lstrip("/")
    content_type = getattr(target_part, "content_type", "")
    blob = target_part.blob

    ext = Path(partname).suffix or extension_from_content_type(content_type)
    filename = f"{rid}{ext}"
    output_path = images_dir / filename
    output_path.write_bytes(blob)

    return {
        "rid": rid,
        "path": str(output_path),
        "original_part": partname,
        "content_type": content_type,
    }


def save_cell_images(cell, doc_part, images_dir: Path):
    saved_images = []
    seen_rids = set()

    for blip in cell._tc.findall('.//a:blip', NS):
        rid = blip.get(f'{{{NS["r"]}}}embed') or blip.get(f'{{{NS["r"]}}}link')
        if not rid or rid in seen_rids:
            continue
        seen_rids.add(rid)
        info = extract_image_from_rel(rid, doc_part, images_dir)
        if info:
            saved_images.append(info)

    for imagedata in cell._tc.findall('.//v:imagedata', NS):
        rid = imagedata.get(f'{{{NS["r"]}}}id')
        if not rid or rid in seen_rids:
            continue
        seen_rids.add(rid)
        info = extract_image_from_rel(rid, doc_part, images_dir)
        if info:
            saved_images.append(info)

    return saved_images


def parse_answer_pairs(cells, start_index=3):
    answers = []
    i = start_index
    while i + 1 < len(cells):
        answer_text = normalize_text(cells[i].text)
        answer_flag = flag_to_bool(cells[i + 1].text)

        if answer_text or answer_flag is not None:
            answers.append({
                "testo": answer_text,
                "corretta": answer_flag,
            })
        i += 2
    return answers


def parse_docx(input_docx: Path, output_json: Path, images_dir: Path | None = None):
    doc = Document(str(input_docx))
    results = []

    if images_dir is None:
        base = output_json.with_suffix("")
        images_dir = base.parent / f"{base.name}_images"
    images_dir.mkdir(parents=True, exist_ok=True)

    # ZipFile left here intentionally: useful if you want future low-level OOXML handling.
    with ZipFile(input_docx, "r"):
        for table_index, table in enumerate(doc.tables):
            for row_index, row in enumerate(table.rows):
                cells = row.cells
                if len(cells) < 5:
                    continue

                raw_id = normalize_text(cells[0].text)
                if not raw_id.isdigit():
                    continue

                answers = parse_answer_pairs(cells, start_index=3)
                item = {
                    "id": int(raw_id),
                    "immagine": save_cell_images(cells[1], doc.part, images_dir),
                    "domanda": normalize_text(cells[2].text),
                    "risposte": answers,
                    "meta": {
                        "table_index": table_index,
                        "row_index": row_index,
                        "numero_risposte": len(answers),
                    },
                }
                results.append(item)

    output_json.parent.mkdir(parents=True, exist_ok=True)
    with output_json.open("w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    return results


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Estrae quiz da un DOCX con colonne del tipo: "
            "id, immagine, domanda, risposta1, v/f, risposta2, v/f, ..."
        )
    )
    parser.add_argument("input_docx", type=Path, help="Percorso del file DOCX")
    parser.add_argument("output_json", type=Path, help="Percorso del JSON di output")
    parser.add_argument(
        "--images-dir",
        type=Path,
        default=None,
        help="Cartella in cui salvare le immagini estratte (default: <output_json>_images)",
    )
    args = parser.parse_args()

    results = parse_docx(args.input_docx, args.output_json, args.images_dir)
    print(f"Estratti {len(results)} quiz in {args.output_json}")


if __name__ == "__main__":
    main()
