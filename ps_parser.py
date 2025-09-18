#!/usr/bin/env python3
"""
SIH 2025 Problem Statement Parser
This script parses the PS.json file and creates readable outputs for analysis
"""

import json
import os
from datetime import datetime

def load_ps_data(file_path):
    """Load the problem statements from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"✅ Loaded {len(data)} problem statements successfully!")
        return data
    except FileNotFoundError:
        print(f"❌ Error: File {file_path} not found!")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {e}")
        return None

def create_summary_file(data, output_path):
    """Create a summary file with titles and brief descriptions"""
    try:
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write("SIH 2025 Problem Statements Summary\n")
            file.write("=" * 50 + "\n")
            file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            file.write(f"Total Problems: {len(data)}\n\n")
            
            for i, ps in enumerate(data, 1):
                file.write(f"{i}. {ps.get('Statement_id', 'N/A')}\n")
                file.write(f"   Title: {ps.get('Title', 'N/A')}\n")
                file.write(f"   Theme: {ps.get('Theme', 'N/A')}\n")
                file.write(f"   Category: {ps.get('Category', 'N/A')}\n")
                file.write(f"   Organization: {ps.get('Organisation', 'N/A')}\n")
                
                # Truncate description to first 200 characters
                desc = ps.get('Description', 'N/A')
                if len(desc) > 200:
                    desc = desc[:200] + "..."
                file.write(f"   Description: {desc}\n")
                file.write("-" * 80 + "\n\n")
        
        print(f"✅ Summary saved to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error creating summary file: {e}")

def create_detailed_file(data, output_path):
    """Create a detailed file with full descriptions"""
    try:
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write("SIH 2025 Problem Statements - Detailed View\n")
            file.write("=" * 60 + "\n")
            file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            file.write(f"Total Problems: {len(data)}\n\n")
            
            for i, ps in enumerate(data, 1):
                file.write(f"\n{'='*80}\n")
                file.write(f"PROBLEM {i}: {ps.get('Statement_id', 'N/A')}\n")
                file.write(f"{'='*80}\n")
                file.write(f"TITLE: {ps.get('Title', 'N/A')}\n\n")
                file.write(f"THEME: {ps.get('Theme', 'N/A')}\n")
                file.write(f"CATEGORY: {ps.get('Category', 'N/A')}\n")
                file.write(f"DEPARTMENT: {ps.get('Department', 'N/A')}\n")
                file.write(f"ORGANIZATION: {ps.get('Organisation', 'N/A')}\n")
                file.write(f"DATASET: {ps.get('Datasetfile', 'N/A')}\n\n")
                file.write(f"DESCRIPTION:\n{ps.get('Description', 'N/A')}\n\n")
        
        print(f"✅ Detailed file saved to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error creating detailed file: {e}")

def create_theme_analysis(data, output_path):
    """Create analysis by themes"""
    try:
        # Group by themes
        themes = {}
        for ps in data:
            theme = ps.get('Theme', 'Unknown')
            if theme not in themes:
                themes[theme] = []
            themes[theme].append(ps)
        
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write("SIH 2025 Problem Statements - Theme Analysis\n")
            file.write("=" * 50 + "\n")
            file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            file.write(f"Total Themes: {len(themes)}\n\n")
            
            # Sort themes by number of problems
            sorted_themes = sorted(themes.items(), key=lambda x: len(x[1]), reverse=True)
            
            file.write("THEME SUMMARY:\n")
            file.write("-" * 30 + "\n")
            for theme, problems in sorted_themes:
                file.write(f"{theme}: {len(problems)} problems\n")
            
            file.write("\n\nDETAILED BY THEME:\n")
            file.write("=" * 50 + "\n")
            
            for theme, problems in sorted_themes:
                file.write(f"\n🎯 THEME: {theme} ({len(problems)} problems)\n")
                file.write("-" * 60 + "\n")
                
                for ps in problems:
                    file.write(f"  • {ps.get('Statement_id', 'N/A')}: {ps.get('Title', 'N/A')}\n")
                    file.write(f"    Org: {ps.get('Organisation', 'N/A')}\n")
                    desc = ps.get('Description', 'N/A')
                    if len(desc) > 150:
                        desc = desc[:150] + "..."
                    file.write(f"    Desc: {desc}\n\n")
        
        print(f"✅ Theme analysis saved to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error creating theme analysis: {e}")

def search_keywords(data, keywords, output_path):
    """Search for specific keywords in titles and descriptions"""
    try:
        results = []
        
        for ps in data:
            title = ps.get('Title', '').lower()
            desc = ps.get('Description', '').lower()
            
            for keyword in keywords:
                if keyword.lower() in title or keyword.lower() in desc:
                    if ps not in results:
                        results.append(ps)
                    break
        
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(f"SIH 2025 Problem Statements - Keyword Search Results\n")
            file.write("=" * 60 + "\n")
            file.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            file.write(f"Keywords searched: {', '.join(keywords)}\n")
            file.write(f"Results found: {len(results)}\n\n")
            
            for i, ps in enumerate(results, 1):
                file.write(f"{i}. {ps.get('Statement_id', 'N/A')}\n")
                file.write(f"   Title: {ps.get('Title', 'N/A')}\n")
                file.write(f"   Theme: {ps.get('Theme', 'N/A')}\n")
                file.write(f"   Description: {ps.get('Description', 'N/A')[:300]}...\n")
                file.write("-" * 80 + "\n\n")
        
        print(f"✅ Search results saved to: {output_path}")
        return results
        
    except Exception as e:
        print(f"❌ Error in keyword search: {e}")
        return []

def main():
    """Main function to run the parser"""
    print("🚀 SIH 2025 Problem Statement Parser")
    print("=" * 40)
    
    # File paths
    json_file = "assets/data/PS.json"
    output_dir = "parsed_data"
    
    # Create output directory
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 Created directory: {output_dir}")
    
    # Load data
    data = load_ps_data(json_file)
    if not data:
        return
    
    # Generate files
    print("\n📄 Generating output files...")
    
    # 1. Summary file
    create_summary_file(data, f"{output_dir}/ps_summary.txt")
    
    # 2. Detailed file
    create_detailed_file(data, f"{output_dir}/ps_detailed.txt")
    
    # 3. Theme analysis
    create_theme_analysis(data, f"{output_dir}/ps_themes.txt")
    
    # 4. Search for unique keywords
    unique_keywords = ["kolam", "blockchain", "quantum", "space", "ocean", "marine", "art", "culture", "heritage"]
    search_results = search_keywords(data, unique_keywords, f"{output_dir}/ps_unique_search.txt")
    
    print(f"\n✅ All files generated successfully in '{output_dir}' folder!")
    print(f"📊 Found {len(search_results)} problems with unique keywords")
    
    # Quick stats
    categories = {}
    for ps in data:
        cat = ps.get('Category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📈 Quick Stats:")
    print("-" * 20)
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")

if __name__ == "__main__":
    main()
