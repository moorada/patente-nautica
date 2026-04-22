#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

DATASETS = [
    ROOT / "data/quizzes/base.json",
    ROOT / "data/quizzes/vela.json",
    ROOT / "data/quizzes/ELENCO QUIZ SU ELEMENTI DI CARTEGGIO.json",
    ROOT / "data/quizzes/ELENCO PROVE CARTEGGIO.json",
    ROOT / "data/quizzes/ELENCO PROVE CARTEGGI1.json",
]

TERM_PATTERNS = [
    (r"\bprua\b|\bprora\b|\bprodier", "prua", "parte anteriore dell'imbarcazione"),
    (r"\bpoppa\b|\bpoppier", "poppa", "parte posteriore dell'imbarcazione"),
    (r"\btribordo\b", "tribordo", "lato destro guardando verso prua"),
    (r"\bbabordo\b", "babordo", "lato sinistro guardando verso prua"),
    (r"\bdritta\b", "dritta", "sinonimo di lato di tribordo"),
    (r"\brotta\b", "rotta", "direzione seguita o da seguire"),
    (r"\brilevamento\b", "rilevamento", "direzione di un punto rispetto a un riferimento"),
    (r"\bfanal", "fanale", "luce di navigazione che identifica posizione o manovra"),
    (r"\bfaro\b", "faro", "segnalamento luminoso costiero usato come riferimento"),
    (r"\bbussola\b", "bussola", "strumento per orientarsi e leggere direzioni"),
    (r"\bnod[oi]?\b", "nodo", "unità di velocità: 1 miglio nautico all'ora"),
    (r"\bmigli", "miglio nautico", "unità di distanza in mare (1852 metri)"),
    (r"\blat\.\b|\blatitudine\b", "latitudine", "coordinata geografica nord/sud"),
    (r"\blong\.\b|\blongitudine\b", "longitudine", "coordinata geografica est/ovest"),
    (r"\bcima\b", "cima", "corda usata a bordo per ormeggio o manovre"),
    (r"\bormeggi", "ormeggio", "operazioni per fissare l'unità in porto"),
    (r"\bancora\b", "ancora", "attrezzo che tiene ferma l'unità sul fondale"),
    (r"\bcarteggio\b", "carteggio", "calcolo su carta nautica di rotta, posizione e tempi"),
    (r"\bscandaglio\b|\becoscandaglio\b", "scandaglio", "strumento per misurare la profondità"),
    (r"\bbolina\b", "bolina", "andatura a vela con vento vicino alla prua"),
    (r"\blasco\b", "lasco", "andatura a vela con vento al traverso-largo"),
    (r"\btraverso\b", "traverso", "direzione perpendicolare all'asse prua-poppa"),
    (r"\bderiva\b", "deriva", "spostamento laterale causato da vento o corrente"),
    (r"\bcorrente\b", "corrente", "movimento della massa d'acqua che altera la rotta"),
    (r"\bscarroccio\b", "scarroccio", "deviazione causata dal vento sull'unità"),
    (r"\btimone\b", "timone", "organo usato per governare la direzione"),
    (r"\bcarena\b", "carena", "parte immersa dello scafo"),
    (r"\bmetacent", "metacentro", "punto usato per valutare la stabilità"),
    (r"\biniettor", "iniettore", "organo che nebulizza il carburante nel motore diesel"),
    (r"\bgasolio\b", "gasolio", "carburante tipico dei motori diesel"),
    (r"\bcandel", "candela", "nei motori benzina genera la scintilla di accensione"),
    (r"\bscintilla\b", "scintilla", "innesco elettrico della combustione nei motori a benzina"),
]


def clean_text(value):
    if not isinstance(value, str):
        return ""
    return re.sub(r"\s+", " ", value).strip()


def contains_number(text):
    return bool(re.search(r"\d", text))


def stable_pick(seed_text, options):
    if not options:
        return ""
    idx = sum(ord(ch) for ch in seed_text) % len(options)
    return options[idx]


def detect_terms(blob, max_terms=2):
    low = blob.lower()
    found = []
    seen = set()

    for pattern, label, definition in TERM_PATTERNS:
        if not re.search(pattern, low):
            continue

        # Evita falsi positivi: "corrente elettrica" non è corrente marina.
        if label == "corrente":
            if "corrente elettrica" in low and not any(
                k in low for k in ["corrente marina", "deriva", "scarroccio", "rotta", "prora", "navigazione"]
            ):
                continue

        if label in seen:
            continue

        seen.add(label)
        found.append((label, definition))
        if len(found) >= max_terms:
            break

    return found


def build_terms_note(blob, max_terms=2):
    terms = detect_terms(blob, max_terms=max_terms)
    if not terms:
        return ""

    if len(terms) == 1:
        label, definition = terms[0]
        return f"Termine nautico: {label} = {definition}."

    joined = "; ".join(f"{label} = {definition}" for label, definition in terms)
    return f"Termini nautici: {joined}."


def parse_base_item(item):
    answers = []
    correct = ""
    for ans in item.get("risposte", []):
        text = clean_text(ans.get("testo", ""))
        if not text:
            continue
        answers.append(text)
        if ans.get("corretta"):
            correct = text

    wrongs = [x for x in answers if x != correct]
    return correct, wrongs, " ".join(answers)


def parse_vela_item(item):
    answers = []
    correct = ""

    keys = sorted(
        [k for k in item.keys() if k.startswith("risposta")],
        key=lambda k: int(re.sub(r"\D", "", k) or "0"),
    )

    for key in keys:
        value = item.get(key)
        if not isinstance(value, dict):
            continue
        text = clean_text(value.get("testo", ""))
        if not text:
            continue
        answers.append(text)
        if value.get("corretta"):
            correct = text

    wrongs = [x for x in answers if x != correct]
    return correct, wrongs, " ".join(answers)


def true_false_reason(statement, correct_tf):
    s = statement.lower()

    if correct_tf == "FALSO":
        if "sempre" in s:
            return "L'affermazione usa un assoluto (" + '"sempre"' + ") che in navigazione non regge: il risultato dipende dalle condizioni reali."
        if "mai" in s:
            return "L'affermazione è troppo assoluta: in pratica esistono casi in cui ciò avviene."
        if any(k in s for k in ["ortogonal", "90", "180"]):
            return "Il rapporto tra le grandezze indicate non è fisso: varia con andatura, velocità e condizioni meteo-marine."
        return "L'enunciato non è coerente con la regola operativa: trascura condizioni e variabili che cambiano il risultato."

    if "sempre" in s:
        return "L'enunciato è corretto perché descrive una regola generale valida in tutte le condizioni previste dal quesito."

    return "L'enunciato è corretto perché rispecchia la regola tecnica applicata in navigazione."


def infer_specific_reason(question, correct, wrongs):
    text = (question + " " + correct + " " + " ".join(wrongs)).lower()

    if "iniettor" in text and ("diesel" in text or "gasolio" in text):
        return (
            "Nel diesel l'iniettore polverizza il gasolio nella camera di combustione: "
            "serve a favorire una combustione rapida e uniforme."
        )

    if "candela" in text and ("diesel" in text or "gasolio" in text):
        return "Nei diesel l'accensione non avviene con candela/scintilla ma per compressione del gasolio in aria calda."

    if any(k in text for k in ["precedenza", "fanale", "abbordaggio", "colreg", "segnale", "rilevamento"]):
        return "Questa opzione applica la regola di condotta e segnalazione prevista per evitare manovre pericolose."

    if any(k in text for k in ["prua", "poppa", "tribordo", "babordo", "assetto", "carena", "stabilità", "metacent"]):
        return "Questa è la definizione tecnica corretta del termine usato a bordo."

    if any(k in text for k in ["corrente", "deriva", "scarroccio", "carteggio", "rotta", "prora", "lat.", "long."]):
        return "Questa risposta è coerente con il metodo di carteggio e con la correzione di deriva/corrente."

    if any(k in text for k in ["ormeggio", "ancora", "cima", "nodo"]):
        return "Questa opzione descrive la procedura corretta per la manovra in sicurezza."

    if any(k in text for k in ["motore", "elica", "gasolio", "carburante", "raffreddamento", "lubrificazione"]):
        return "Questa opzione descrive correttamente funzione e principio di lavoro del componente motore."

    if contains_number(text):
        return "Questa opzione riporta il valore operativo/normativo corretto nel contesto richiesto."

    return stable_pick(
        question + " " + correct,
        [
            "Questa opzione è quella tecnicamente coerente con la regola richiesta dal quesito.",
            "La scelta corretta applica il principio operativo previsto per questo argomento.",
            "Questa risposta è corretta perché mantiene coerenza tecnica tra definizione e uso pratico.",
            "Tra le alternative è l'unica che rispetta il criterio tecnico richiesto.",
        ],
    )


def contrast_note(question, correct, wrongs):
    text = (question + " " + correct + " " + " ".join(wrongs)).lower()

    if "iniettor" in text and any("serbatoio" in w.lower() for w in wrongs):
        return "Le alternative che parlano di pescaggio dal serbatoio descrivono invece il lavoro della pompa di alimentazione."

    if ("diesel" in text or "gasolio" in text) and any(
        ("candela" in w.lower()) or ("scintilla" in w.lower()) for w in wrongs
    ):
        return "Le opzioni con candela/scintilla si riferiscono ai motori a benzina, non al ciclo diesel."

    return ""


def build_choice_explanation(question, correct, wrongs, terms_blob, max_terms=2):
    c = clean_text(correct)
    if not c:
        base = "Spiegazione non disponibile: manca la risposta corretta nel dataset."
        terms = build_terms_note(terms_blob, max_terms=max_terms)
        return f"{base} {terms}".strip()

    uc = c.upper()
    if uc in {"VERO", "FALSO"}:
        reason = true_false_reason(question, uc)
    else:
        reason = infer_specific_reason(question, c, wrongs)

    contrast = contrast_note(question, c, wrongs)
    terms = build_terms_note(terms_blob, max_terms=max_terms)

    parts = [f"Perché è giusta: {reason}"]
    if contrast:
        parts.append(contrast)
    if terms:
        parts.append(terms)

    return " ".join(parts).strip()


def extract_solution_parts(item):
    parts = []
    raw = item.get("risposte")

    if isinstance(raw, list):
        for v in raw:
            t = clean_text(str(v))
            if t:
                parts.append(t)

    single = clean_text(item.get("risposta", ""))
    if single and single not in parts:
        parts.append(single)

    return parts


def open_reason(question, parts):
    text = (question + " " + " ".join(parts)).lower()

    if any(k in text for k in ["rotta", "prora", "rilevamento", "lat.", "long.", "carteggio"]):
        return (
            "La risposta si ottiene impostando correttamente il carteggio: posizione iniziale, "
            "tracce sulla carta e lettura finale del dato richiesto."
        )

    if any(k in text for k in ["corrente", "deriva", "scarroccio"]):
        return (
            "La soluzione deriva dalla composizione vettoriale tra moto proprio e perturbazioni "
            "(corrente/deriva), con verifica del risultato finale."
        )

    if any(k in text for k in ["tempo", "ore", "h", "nodi", "miglio"]):
        return "La soluzione nasce dalla corretta relazione tra spazio, velocità e tempo, con unità coerenti."

    if any(k in text for k in ["fanale", "segnale", "precedenza"]):
        return "La risposta è corretta perché applica la regola di condotta e segnalazione prevista dal caso."

    return (
        "La risposta è corretta perché segue la procedura tecnica richiesta: impostazione dei dati, "
        "applicazione della regola e controllo di coerenza finale."
    )


def build_open_explanation(question, parts, max_terms=2):
    reason = open_reason(question, parts)
    terms = build_terms_note(question + " " + " ".join(parts), max_terms=max_terms)

    if terms:
        return f"{reason} {terms}"
    return reason


def fill_array_file(path, parser, force=False, max_terms=2):
    data = json.loads(path.read_text(encoding="utf-8"))
    updated = 0

    for item in data:
        existing = clean_text(item.get("spiegazione", ""))
        if existing and not force:
            continue

        question = clean_text(item.get("domanda", ""))
        correct, wrongs, answers_blob = parser(item)
        terms_blob = " ".join([question, answers_blob])

        item["spiegazione"] = build_choice_explanation(
            question,
            correct,
            wrongs,
            terms_blob,
            max_terms=max_terms,
        )
        updated += 1

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return updated, len(data)


def fill_items_file(path, force=False, max_terms=2):
    data = json.loads(path.read_text(encoding="utf-8"))
    items = data.get("items", [])
    updated = 0

    for item in items:
        existing = clean_text(item.get("spiegazione", ""))
        if existing and not force:
            continue

        question = clean_text(item.get("domanda", ""))
        parts = extract_solution_parts(item)
        item["spiegazione"] = build_open_explanation(question, parts, max_terms=max_terms)
        updated += 1

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return updated, len(items)


def main():
    parser = argparse.ArgumentParser(description="Genera spiegazioni nei dataset quiz.")
    parser.add_argument("--force", action="store_true", help="Rigenera anche spiegazioni già presenti.")
    parser.add_argument("--max-terms", type=int, default=2, help="Numero massimo di termini nautici per spiegazione.")
    args = parser.parse_args()

    base_updated, base_total = fill_array_file(
        DATASETS[0],
        parse_base_item,
        force=args.force,
        max_terms=args.max_terms,
    )
    vela_updated, vela_total = fill_array_file(
        DATASETS[1],
        parse_vela_item,
        force=args.force,
        max_terms=args.max_terms,
    )
    elem_updated, elem_total = fill_items_file(
        DATASETS[2],
        force=args.force,
        max_terms=args.max_terms,
    )
    carta_updated, carta_total = fill_items_file(
        DATASETS[3],
        force=args.force,
        max_terms=args.max_terms,
    )
    cartb_updated, cartb_total = fill_items_file(
        DATASETS[4],
        force=args.force,
        max_terms=args.max_terms,
    )

    print(f"base: {base_updated}/{base_total} spiegazioni generate")
    print(f"vela: {vela_updated}/{vela_total} spiegazioni generate")
    print(f"elementi: {elem_updated}/{elem_total} spiegazioni generate")
    print(f"carteggio A: {carta_updated}/{carta_total} spiegazioni generate")
    print(f"carteggio B: {cartb_updated}/{cartb_total} spiegazioni generate")


if __name__ == "__main__":
    main()
