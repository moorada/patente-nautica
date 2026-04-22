#!/usr/bin/env python3
"""
Estrae quiz/prove da DOCX con formati simili a:
1) PROVE CARTEGGIO:
   id | domanda | risposta
   oppure tabelle con celle duplicate/merge da Word
2) QUIZ SU ELEMENTI DI CARTEGGIO:
   id | domanda | risposta1 | risposta2 | risposta3 | risposta4 | risposta5

Output JSON normalizzato.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from docx import Document


def clean_text(value: str) -> str:
    if value is None:
        return ""
    value = value.replace("\xa0", " ")
    value = value.replace("\r", "\n")
    lines = [re.sub(r"\s+", " ", line).strip() for line in value.split("\n")]
    lines = [line for line in lines if line]
    return "\n".join(lines).strip()


def is_integer_text(value: str) -> bool:
    return bool(re.fullmatch(r"\d+", value.strip()))


def dedupe_preserve_order(values: list[str]) -> list[str]:
    out: list[str] = []
    for v in values:
        if v and v not in out:
            out.append(v)
    return out


def normalize_row_texts(row) -> list[str]:
    """
    Alcuni DOCX hanno celle duplicate per via di merge orizzontali/verticali.
    Qui ripuliamo e rimuoviamo i duplicati consecutivi/identici mantenendo l'ordine.
    """
    raw = [clean_text(c.text) for c in row.cells]
    raw = [x for x in raw if x]

    normalized: list[str] = []
    for item in raw:
        if not normalized or normalized[-1] != item:
            normalized.append(item)

    # Se rimangono duplicati non consecutivi, li togliamo comunque.
    normalized = dedupe_preserve_order(normalized)
    return normalized


def row_looks_like_header(values: list[str]) -> bool:
    joined = " ".join(values).upper()
    header_tokens = [
        "TESTO DELLA DOMANDA",
        "RISPOSTA",
        "RISPOSTA 1",
        "RISPOSTA 2",
        "RISPOSTA 3",
        "RISPOSTA 4",
        "RISPOSTA 5",
        "IMMAGINE",
    ]
    if any(token in joined for token in header_tokens):
        return True
    if not values:
        return True
    return False


def parse_table_row(values: list[str], table_index: int, row_index: int) -> dict[str, Any] | None:
    """
    Converte una riga normalizzata in un record.
    Formati supportati:
      [id, domanda, risposta]
      [id, domanda, risposta1, risposta2, ...]
    """
    if not values or row_looks_like_header(values):
        return None

    if not is_integer_text(values[0]):
        return None

    if len(values) < 3:
        return None

    qid = int(values[0])
    question = values[1]
    answers = values[2:]

    if not question or not answers:
        return None

    item: dict[str, Any] = {
        "id": qid,
        "domanda": question,
        "risposte": answers,
        "meta": {
            "table_index": table_index,
            "row_index": row_index,
            "numero_risposte": len(answers),
            "formato_riga": "singola_risposta" if len(answers) == 1 else "multi_risposta",
        },
    }

    # Campo di compatibilità utile quando c'è una sola risposta
    if len(answers) == 1:
        item["risposta"] = answers[0]

    return item


def extract_docx_to_json(docx_path: Path) -> list[dict[str, Any]]:
    doc = Document(str(docx_path))
    items: list[dict[str, Any]] = []

    for table_index, table in enumerate(doc.tables):
        for row_index, row in enumerate(table.rows):
            values = normalize_row_texts(row)
            item = parse_table_row(values, table_index, row_index)
            if item is not None:
                items.append(item)

    # Ordina per ID se presenti fuori ordine
    items.sort(key=lambda x: x.get("id", 0))
    return items


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Estrae quiz/prove da DOCX e salva in JSON."
    )
    parser.add_argument("input", help="File DOCX in input")
    parser.add_argument("output", help="File JSON in output")
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Salva JSON indentato (default: sì)",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    items = extract_docx_to_json(input_path)

    payload = {
        "source_file": input_path.name,
        "total_items": len(items),
        "items": items,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Estratti {len(items)} record in: {output_path}")


if __name__ == "__main__":
    main()
