from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

def scrape_url(url):
    try:
        # Send an HTTP request to the URL
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the HTML content of the page
            soup = BeautifulSoup(response.text, 'html.parser')

            # Example: Extracting all links
            links = [link.get('href') for link in soup.find_all('a')]

            # You can customize this to extract other information based on your needs

            return {"success": True, "data": links}
        else:
            return {"success": False, "error": f"Failed to retrieve the page. Status code: {response.status_code}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        # Get URL from the request data
        data = request.get_json()
        url = data.get('url')

        if not url:
            return jsonify({"success": False, "error": "URL is required"})

        # Call the scraping function
        result = scrape_url(url)

        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)