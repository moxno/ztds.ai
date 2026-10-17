import re, os, subprocess

def format_text(text):
    # Bold & code
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
    
    # Mathematical and technical symbol typography
    text = text.replace('s_k > s_{k-1} > ... > s_1', '<i>s</i><sub><i>k</i></sub> &gt; <i>s</i><sub><i>k</i>&minus;1</sub> &gt; &hellip; &gt; <i>s</i><sub>1</sub>')
    text = text.replace('s_k > ... > s_1', '<i>s</i><sub><i>k</i></sub> &gt; &hellip; &gt; <i>s</i><sub>1</sub>')
    text = text.replace('O(N log N)', '<i>O</i>(<i>N</i> log <i>N</i>)')
    text = text.replace('O(N)', '<i>O</i>(<i>N</i>)')
    text = text.replace('Delta_L = 11 - 8 = 3', '&Delta;<i>L</i> = 11 &minus; 8 = 3')
    text = text.replace('Delta_L = L_s - L_e', '&Delta;<i>L</i> = <i>L</i><sub><i>s</i></sub> &minus; <i>L</i><sub><i>e</i></sub>')
    text = text.replace('Delta_L', '&Delta;<i>L</i>')
    text = text.replace('M_s', '<i>M</i><sub><i>s</i></sub>')
    text = text.replace('Q_T', '<i>Q</i><sub><i>T</i></sub>')
    text = text.replace('R_T', '<i>R</i><sub><i>T</i></sub>')
    text = text.replace('L_e', '<i>L</i><sub><i>e</i></sub>')
    text = text.replace('L_s', '<i>L</i><sub><i>s</i></sub>')
    text = text.replace('sigma_j', '&sigma;<sub><i>j</i></sub>')
    text = text.replace('sigma_1', '&sigma;<sub>1</sub>')
    text = text.replace('sigma_2', '&sigma;<sub>2</sub>')
    text = text.replace('sigma_k', '&sigma;<sub><i>k</i></sub>')
    text = text.replace('tau_j', '&tau;<sub><i>j</i></sub>')
    text = text.replace('X_hat', '<i>X&#770;</i>')
    text = text.replace('Sigma*', '&Sigma;*')
    return text

def md_to_html(md_text, title, rtl=False):
    lines = md_text.split('\n')
    html_lines = []
    in_list = False
    in_code = False
    in_table = False
    
    for line in lines:
        if line.strip().startswith('```'):
            if in_code:
                html_lines.append('</code></pre>')
                in_code = False
            else:
                html_lines.append('<pre><code>')
                in_code = True
            continue
        if in_code:
            html_lines.append(line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
            continue
            
        s = line.strip()
        if not s:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            if in_table:
                html_lines.append('</tbody></table>')
                in_table = False
            continue
            
        # Tables
        if s.startswith('|') and s.endswith('|'):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            # Check if separator line
            if re.match(r'^\|[\s\-:|]+\|$', s):
                continue
            cells = [c.strip() for c in s[1:-1].split('|')]
            if not in_table:
                html_lines.append('<table class="data-table"><thead><tr>')
                for c in cells:
                    html_lines.append(f'<th>{format_text(c)}</th>')
                html_lines.append('</tr></thead><tbody>')
                in_table = True
            else:
                html_lines.append('<tr>')
                for c in cells:
                    html_lines.append(f'<td>{format_text(c)}</td>')
                html_lines.append('</tr>')
            continue
        else:
            if in_table:
                html_lines.append('</tbody></table>')
                in_table = False
            
        # Headers
        m = re.match(r'^(#{1,6})\s+(.*)', s)
        if m:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            level = len(m.group(1))
            header_text = m.group(2)
            html_lines.append(f'<h{level}>{format_text(header_text)}</h{level}>')
            continue
            
        # Horizontal rule
        if re.match(r'^(-{3,}|\*{3,}|_{3,})$', s):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append('<hr>')
            continue
            
        # Formula blocks
        if s.startswith('**[Formula'):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append(f'<div class="formula-box"><b>{s[2:-2]}</b></div>')
            continue

        # Unordered list
        if s.startswith('* ') or s.startswith('- ') or s.startswith('• '):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            item_text = s[2:].strip()
            html_lines.append(f'<li>{format_text(item_text)}</li>')
            continue
        else:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
                
        # Numbered list
        m_num = re.match(r'^(\d+)\.\s+(.*)', s)
        if m_num:
            num = m_num.group(1)
            item_text = m_num.group(2)
            html_lines.append(f'<p style="margin-left: 20px;"><b>{num}.</b> {format_text(item_text)}</p>')
            continue
            
        # Normal paragraph
        p_text = format_text(s)
        html_lines.append(f'<p>{p_text}</p>')
        
    if in_list:
        html_lines.append('</ul>')
    if in_table:
        html_lines.append('</tbody></table>')
    if in_code:
        html_lines.append('</code></pre>')
        
    direction = 'rtl' if rtl else 'ltr'
    align = 'right' if rtl else 'left'
    padding_side = 'right' if rtl else 'left'
    lang = 'he' if rtl else 'en'
    
    return f"""<!DOCTYPE html>
<html dir="{direction}" lang="{lang}">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  @page {{
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.55;
    color: #1a202c;
    direction: {direction};
    text-align: {align};
    margin: 0;
    padding: 10px;
  }}
  h1 {{ font-size: 15pt; color: #1a365d; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px; margin-top: 20px; page-break-after: avoid; }}
  h2 {{ font-size: 12.5pt; color: #2b6cb0; border-bottom: 1px solid #cbd5e0; padding-bottom: 4px; margin-top: 18px; page-break-after: avoid; }}
  h3 {{ font-size: 11pt; color: #2d3748; margin-top: 14px; page-break-after: avoid; }}
  h4 {{ font-size: 10pt; color: #4a5568; margin-top: 10px; page-break-after: avoid; }}
  p {{ margin: 6px 0; }}
  ul {{ padding-{padding_side}: 20px; margin: 6px 0; }}
  li {{ margin-bottom: 4px; }}
  code {{ font-family: Menlo, Monaco, Courier, monospace; background: #edf2f7; padding: 2px 4px; border-radius: 3px; font-size: 8.5pt; direction: ltr; display: inline-block; }}
  pre {{ background: #f7fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 8pt; direction: ltr; text-align: left; }}
  pre code {{ background: none; padding: 0; }}
  .formula-box {{ background: #f0f4f8; border-left: 3px solid #2b6cb0; padding: 6px 12px; margin: 10px 0 4px 0; font-family: Menlo, Monaco, Courier, monospace; font-size: 9pt; }}
  table.data-table {{ width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 8.5pt; page-break-inside: avoid; }}
  table.data-table th, table.data-table td {{ border: 1px solid #cbd5e0; padding: 6px 8px; text-align: {align}; }}
  table.data-table th {{ background-color: #ebf8ff; color: #2b6cb0; font-weight: bold; }}
  table.data-table tr:nth-child(even) {{ background-color: #f7fafc; }}
  hr {{ border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0; }}
</style>
</head>
<body>
{chr(10).join(html_lines)}
</body>
</html>"""

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    chrome_bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    
    # 1. ZTDS PCT Engineering Examination Guide (English SSOT)
    guide_md_path = os.path.join(root, 'docs/legal/internal/ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.md')
    guide_html_path = os.path.join(root, 'docs/legal/internal/ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.html')
    guide_pdf_path = os.path.join(root, 'docs/legal/internal/ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.pdf')
    
    with open(guide_md_path, 'r', encoding='utf-8') as f:
        guide_md = f.read()
    
    guide_html = md_to_html(guide_md, 'ZTDS Patent Engineering Examination Guide', rtl=False)
    with open(guide_html_path, 'w', encoding='utf-8') as f:
        f.write(guide_html)
    print(f'Wrote {guide_html_path}')
    
    subprocess.run([
        chrome_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={guide_pdf_path}',
        guide_html_path
    ], check=True)
    print(f'Generated {guide_pdf_path}')
    
    # 2. WIPO PCT Specification & Claims (English)
    pct_md_path = os.path.join(root, 'docs/legal/internal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.md')
    pct_html_path = os.path.join(root, 'docs/legal/internal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.html')
    pct_pdf_path = os.path.join(root, 'docs/legal/internal/WIPO_PCT_PATENT_SPECIFICATION_AND_CLAIMS.pdf')
    
    with open(pct_md_path, 'r', encoding='utf-8') as f:
        pct_md = f.read()
        
    pct_html = md_to_html(pct_md, 'WIPO PCT International Patent Specification & Claims', rtl=False)
    with open(pct_html_path, 'w', encoding='utf-8') as f:
        f.write(pct_html)
    print(f'Wrote {pct_html_path}')
    
    subprocess.run([
        chrome_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={pct_pdf_path}',
        pct_html_path
    ], check=True)
    print(f'Generated {pct_pdf_path}')

    # 3. PCT Bibliographic Data Sheet
    sheet_md_path = os.path.join(root, 'docs/legal/internal/05_PCT_Bibliographic_Data_Sheet_IL331905.md')
    sheet_html_path = os.path.join(root, 'docs/legal/internal/05_PCT_Bibliographic_Data_Sheet_IL331905.html')
    sheet_pdf_path = os.path.join(root, 'docs/legal/internal/05_PCT_Bibliographic_Data_Sheet_IL331905.pdf')
    
    with open(sheet_md_path, 'r', encoding='utf-8') as f:
        sheet_md = f.read()
        
    sheet_html = md_to_html(sheet_md, 'PCT Bibliographic Data Sheet — IL 331905', rtl=False)
    with open(sheet_html_path, 'w', encoding='utf-8') as f:
        f.write(sheet_html)
    print(f'Wrote {sheet_html_path}')
    
    subprocess.run([
        chrome_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={sheet_pdf_path}',
        sheet_html_path
    ], check=True)
    print(f'Generated {sheet_pdf_path}')

    # 4. IETF ZTDS Protocol Specification Draft-02
    ietf_html_path = os.path.join(root, 'ietf/draft-sibiryakov-ztds-protocol-02.html')
    ietf_pdf_path = os.path.join(root, 'docs/legal/internal/06_IETF_ZTDS_Protocol_Specification_Draft_02.pdf')
    ietf_dest_pdf = os.path.join(root, 'ietf/draft-sibiryakov-ztds-protocol-02.pdf')
    
    subprocess.run([
        chrome_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={ietf_pdf_path}',
        ietf_html_path
    ], check=True)
    import shutil
    shutil.copy2(ietf_pdf_path, ietf_dest_pdf)
    print(f'Generated {ietf_pdf_path}')

    # Copy to canonical numbered names
    import shutil, zipfile
    internal_dir = os.path.join(root, 'docs/legal/internal')
    num2_pdf = os.path.join(internal_dir, '02_WIPO_PCT_PATENT_SPECIFICATION_AND_20_CLAIMS.pdf')
    num3_pdf = os.path.join(internal_dir, '03_ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.pdf')
    
    shutil.copy2(pct_pdf_path, num2_pdf)
    shutil.copy2(guide_pdf_path, num3_pdf)
    print(f'Updated {num2_pdf}')
    print(f'Updated {num3_pdf}')

    # Regenerate ZIP package
    zip_path = os.path.join(internal_dir, 'ZTDS_PCT_Filing_Package_Priority_IL331905.zip')
    zip_files = [
        ('00_Priority_Document_Official_Filing_Receipt_ILPO_331905_DAS_B17B.pdf', os.path.join(internal_dir, 'ilpo-filing-package/1_331905_15_09_2026_10_27_57-9152026 102757 AM.pdf')),
        ('01_Clean_Patent_Drawings_ZTDS_PCT_5Sheets.pdf', os.path.join(internal_dir, '03_Clean_Patent_Drawings_ZTDS_PCT_5Sheets.pdf')),
        ('02_WIPO_PCT_PATENT_SPECIFICATION_AND_20_CLAIMS.pdf', num2_pdf),
        ('02_WIPO_PCT_PATENT_SPECIFICATION_AND_20_CLAIMS.md', pct_md_path),
        ('03_ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.pdf', num3_pdf),
        ('03_ZTDS_PCT_ENGINEERING_EXAMINATION_GUIDE.md', guide_md_path),
        ('04_Clean_Patent_Drawings_ZTDS_IL331905_Presentation.pptx', os.path.join(internal_dir, '03_Clean_Patent_Drawings_ZTDS_IL331905.pptx')),
        ('04_Clean_Patent_Drawings_ZTDS_IL331905_Presentation.pdf', os.path.join(internal_dir, '03_Clean_Patent_Drawings_ZTDS_IL331905_Slides_Clean.pdf')),
        ('05_PCT_Bibliographic_Data_Sheet_IL331905.pdf', sheet_pdf_path),
        ('05_PCT_Bibliographic_Data_Sheet_IL331905.md', sheet_md_path),
        ('06_IETF_ZTDS_Protocol_Specification_Draft_02.pdf', ietf_pdf_path),
        ('07_ZTDS_Trademark_Filing_Confirmation_ILPO_182655957.pdf', os.path.join(internal_dir, 'ilpo-filing-package/ZTDS_Trademark_Filing_Confirmation_Israel_Patent_Office_182655957.pdf'))
    ]
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for arcname, srcpath in zip_files:
            if os.path.exists(srcpath):
                zf.write(srcpath, arcname)
                print(f'Added to zip: {arcname}')
    print(f'Generated clean {zip_path}')

if __name__ == '__main__':
    main()

