import os
import re
import json

GA_SCRIPT = """
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
"""

BASE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "LIMRA Overseas Education",
    "url": "https://www.limraedu.com",
    "logo": "https://www.limraedu.com/assets/logo-dmsf.webp",
    "description": "South India's No.1 FMGE coaching institute and premier overseas medical education consultancy. 24+ years of experience placing students in Philippines and Timor-Leste.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "New No.177, Royapettah High Road, 1st Floor, SMS Centre",
        "addressLocality": "Mylapore, Chennai",
        "postalCode": "600004",
        "addressCountry": "IN"
    },
    "telephone": "+91-9444375000"
}

def get_college_schema(filename):
    name_map = {
        "dmsf.html": "Davao Medical School Foundation",
        "brokenshire.html": "Brokenshire College",
        "gcm.html": "Gullas College of Medicine",
        "lyceum.html": "Lyceum Northwestern University",
        "ucts.html": "Universidade Católica Timorense",
        "university-of-peace.html": "University of PEACE"
    }
    
    basename = os.path.basename(filename)
    college_name = name_map.get(basename, "Partner Medical University")
    
    schema = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": college_name,
        "description": f"Study MBBS at {college_name}. Admission guidance and free FMGE coaching provided by LIMRA Overseas Education.",
        "provider": BASE_SCHEMA
    }
    return schema

def inject_into_file(filepath, is_college=False):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    # Check if GA already exists
    if "G-XXXXXXXXXX" not in content:
        # Determine schema
        schema_obj = get_college_schema(filepath) if is_college else BASE_SCHEMA
        schema_script = f"""
  <!-- Structured Data (Schema.org) -->
  <script type="application/ld+json">
{json.dumps(schema_obj, indent=2)}
  </script>
"""
        # Inject before </head>
        insertion = GA_SCRIPT + schema_script + "</head>"
        new_content = content.replace("</head>", insertion, 1)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    else:
        print(f"Skipping {filepath} (Already has GA/Schema)")

# Process root HTML files
root_files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in root_files:
    inject_into_file(f, is_college=False)

# Process college HTML files
if os.path.exists('colleges'):
    college_files = [os.path.join('colleges', f) for f in os.listdir('colleges') if f.endswith('.html')]
    for f in college_files:
        inject_into_file(f, is_college=True)

print("Injection complete.")
