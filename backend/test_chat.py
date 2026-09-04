import requests

def test_rag():
    url = "http://localhost:8000/api/chat"
    query = input("\nEnter your query about BIS standards: ")
    print("\nThinking (calling Groq)...")
    
    response = requests.post(url, json={"query": query})
    if response.status_code == 200:
        data = response.json()
        print("\n--- AI ANSWER ---")
        print(data['answer'])
        print("\n--- SOURCES USED ---")
        for idx, src in enumerate(data['sources']):
            print(f"{idx+1}. {src['document']} (Page {src['page']})")
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    test_rag()
