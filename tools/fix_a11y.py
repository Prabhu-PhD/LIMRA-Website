import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original_content = content

    # 1. Add skip link
    if 'class="skip-link"' not in content:
        content = re.sub(
            r'(<body[^>]*>)', 
            r'\1\n  <a href="#main" class="skip-link">Skip to main content</a>', 
            content, 
            count=1
        )

    # 2. Add aria-live to form message
    content = re.sub(
        r'(<div[^>]*class="[^"]*form-msg[^"]*"[^>]*)(?<!aria-live="polite")>',
        r'\1 aria-live="polite">',
        content
    )
    content = re.sub(
        r'(<div[^>]*id="msg"[^>]*class="enquiry-msg"[^>]*)(?<!aria-live="polite")>',
        r'\1 aria-live="polite">',
        content
    )

    # 3. Add default disabled option to course select
    if 'value="" disabled selected' not in content:
        content = re.sub(
            r'(<select[^>]*name="course"[^>]*>)',
            r'\1\n                <option value="" disabled selected>Select a course/college...</option>',
            content
        )

    # 4. Add pattern to phone input
    content = re.sub(
        r'(<input[^>]*type="tel"[^>]*)(?<!pattern="\[0-9\]\{10\}")(/?>)',
        r'\1 pattern="[0-9]{10}"\2',
        content
    )

    # Make sure we add an ID to the main element or the first section if not exists
    # Actually, the skip link goes to #main. Let's ensure <main> has id="main"
    content = re.sub(r'<main(?!\s+id=)', '<main id="main"', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed for {filepath}")

# Gather all HTML files
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
if os.path.exists('colleges'):
    html_files.extend([os.path.join('colleges', f) for f in os.listdir('colleges') if f.endswith('.html')])

for filepath in html_files:
    process_file(filepath)

print("A11y pass complete.")
