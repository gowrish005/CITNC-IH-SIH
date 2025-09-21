import json
from collections import OrderedDict

def sort_venue_details():
    # Load the JSON file
    with open('VenueDetails.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Sort teams within each venue alphabetically by team name
    sorted_data = {}
    for venue, teams in data.items():
        # Sort the teams dictionary by key (team name)
        sorted_teams = OrderedDict(sorted(teams.items()))
        sorted_data[venue] = sorted_teams

    # Save the sorted data back to the file
    with open('VenueDetails.json', 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, indent=4, ensure_ascii=False)

    print("Teams have been sorted alphabetically by team name in each venue.")

if __name__ == "__main__":
    sort_venue_details()
