import json
import zipfile
from io import BytesIO
from pathlib import Path
import xml.etree.ElementTree as ET

import fitz
from PIL import Image


ROOT = Path(r"D:\OneDrive\바탕 화면\Life_System\00_Inbox\ai_top_100_campus_freerider\Team_D")
OUT = Path(r"D:\dev\team_d_extracted")


def ensure_out():
    OUT.mkdir(parents=True, exist_ok=True)


def docx_text(path: Path) -> str:
    parts = []
    with zipfile.ZipFile(path) as zf:
        with zf.open("word/document.xml") as f:
            root = ET.parse(f).getroot()
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    for para in root.findall(".//w:p", ns):
        texts = [node.text for node in para.findall(".//w:t", ns) if node.text]
        if texts:
            parts.append("".join(texts))
    return "\n".join(parts)


def xlsx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as zf:
        shared = []
        if "xl/sharedStrings.xml" in zf.namelist():
            with zf.open("xl/sharedStrings.xml") as f:
                root = ET.parse(f).getroot()
            ns = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
            for si in root.findall(".//s:si", ns):
                text = "".join(t.text or "" for t in si.findall(".//s:t", ns))
                shared.append(text)
        workbook = ET.parse(zf.open("xl/workbook.xml")).getroot()
        ns = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
        rels = ET.parse(zf.open("xl/_rels/workbook.xml.rels")).getroot()
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        lines = []
        for sheet in workbook.findall(".//s:sheet", ns):
            name = sheet.attrib["name"]
            target = rel_map[sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
            sheet_path = target.lstrip("/")
            if sheet_path.startswith("xl/"):
                pass
            elif sheet_path.startswith("worksheets/"):
                sheet_path = f"xl/{sheet_path}"
            else:
                sheet_path = f"xl/{sheet_path}"
            sheet_root = ET.parse(zf.open(sheet_path)).getroot()
            lines.append(f"[Sheet] {name}")
            for row in sheet_root.findall(".//s:row", ns):
                vals = []
                for c in row.findall("s:c", ns):
                    t = c.attrib.get("t")
                    v = c.find("s:v", ns)
                    if v is None:
                        continue
                    value = v.text or ""
                    if t == "s":
                        try:
                            value = shared[int(value)]
                        except Exception:
                            pass
                    vals.append(value)
                if vals:
                    lines.append(" | ".join(vals))
        return "\n".join(lines)


def pdf_pages(path: Path):
    doc = fitz.open(path)
    pages = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        img = Image.open(BytesIO(pix.tobytes("png"))).convert("RGB")
        pages.append((i + 1, img))
    return pages


def image_ocr(images, languages=("ko", "en")):
    import winocr

    out = []
    for name, img in images:
        result = None
        for lang in languages:
            try:
                candidate = winocr.recognize_pil_sync(img, lang=lang)
                text = (candidate or {}).get("text", "").strip()
                if text:
                    result = candidate
                    break
            except Exception:
                continue
        lines = []
        if result:
            for line in result.get("lines", []):
                words = line.get("words", [])
                text = " ".join(word.get("text", "") for word in words).strip()
                if text:
                    lines.append({"text": text, "conf": None, "box": line.get("bounding_rect")})
        out.append({"name": name, "lines": lines})
    return out


def write_text(name: str, text: str):
    (OUT / name).write_text(text, encoding="utf-8")


def main():
    ensure_out()
    resources = []
    for path in sorted((ROOT / "resources").iterdir()):
        if path.suffix.lower() == ".docx":
            text = docx_text(path)
        elif path.suffix.lower() == ".xlsx":
            text = xlsx_text(path)
        else:
            text = ""
        resources.append({"name": path.name, "text": text[:20000]})
        if text:
            write_text(f"resource_{path.stem}.txt", text)

    screenshot_imgs = [(p.name, Image.open(p).convert("RGB")) for p in sorted((ROOT / "screenshots").glob("*.png"))]
    screenshot_ocr = image_ocr(screenshot_imgs)
    (OUT / "screenshots_ocr.json").write_text(json.dumps(screenshot_ocr, ensure_ascii=False, indent=2), encoding="utf-8")

    pdf_ocr = {}
    for pdf_path in sorted((ROOT / "presentation").glob("*.pdf")):
        pages = [(f"{pdf_path.name}#page{i}", img) for i, img in pdf_pages(pdf_path)]
        pdf_ocr[pdf_path.name] = image_ocr(pages)
    (OUT / "presentation_ocr.json").write_text(json.dumps(pdf_ocr, ensure_ascii=False, indent=2), encoding="utf-8")

    (OUT / "resources_text.json").write_text(json.dumps(resources, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
