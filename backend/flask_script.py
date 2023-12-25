from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def scrape_links(soup):
    # Extracting all links
    links = [link.get('href') for link in soup.find_all('a')]
    return {"success": True, "data": links}

def scrape_images(soup):
    # Extracting all image links
    images = [img.get('src') for img in soup.find_all('img')]
    return {"success": True, "data": images}

def scrape_url(url, option='links'):
    try:
        # Send an HTTP request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content of the page
            soup = BeautifulSoup(response.text, 'html.parser')

            if option == 'links':
                return scrape_links(soup)
            elif option == 'images':
                return scrape_images(soup)
            else:
                return {"success": False, "error": "Invalid option. Choose 'links', 'images', or 'metadata'."}
        else:
            return {"success": False, "error": f"Failed to retrieve the page. Status code: {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        # Get URL and option from the request data
        data = request.get_json()
        url = data.get('url')
        option = data.get('option', 'links')  # Default to 'links' if not provided

        if not url:
            return jsonify({"success": False, "error": "URL is required"})

        # Call the scraping function with the specified option
        result = scrape_url(url, option)

        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)