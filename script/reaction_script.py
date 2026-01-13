import requests
import json
 
API_URL = "http://localhost:8080/api/reaction"
 
def add_reaction(data):
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 201:
            print(f"✔ Reaction '{data['name']}' ajoutée avec succès.")
            print(json.dumps(response.json(), indent=4))
        else:
            print(f"❌ Erreur ({response.status_code}) pour '{data['name']}':")
            print(response.text)
    except Exception as e:
        print("❌ Exception :", e)
 
if __name__ == "__main__":
    reactions = [
        # Gmail
        {
            "name": "send_gmail",
            "description": "Send an email via Gmail API",
            "Service": {"service": "Gmail", "service_id": 1, "type": "sendMail"},
            "Params": {"to": "string", "subject": "string", "body":"string"}
        },
        {
            "name": "star_gmail",
            "description": "Star an email in Gmail",
            "Service": {"service": "Gmail", "service_id": 1, "type": "starMail"},
            "Params": {"from": "string", "subject": "string"}
        },
        {
            "name": "delete_gmail",
            "description": "Delete an email in Gmail",
            "Service": {"service": "Gmail", "service_id": 1, "type": "delete"},
            "Params": {"from": "string", "subject": "string"}
        },

        {
            "name": "brouillon_gmail",
            "description": "brouillon an email in Gmail",
            "Service": {"service": "Gmail", "service_id": 1, "type": "Brouillon"},
            "Params": {"to": "string", "subject": "string", "body":"string"}
        },

        # 2. Google Calendar
        {
            "name": "quick_add_event",
            "description": "This Action will add an event to your Google Calendar. Simply include a detailed description of when and what.",
            "Service": {"service": "Google Calendar", "service_id": 2, "type": "quick_add"},
            "Params": {"text": "string", "calendar_id": "string"}
        },
        {
            "name": "create_a_detailed_event",
            "description": "This action will create a detailed event in your Google Calendar.",
            "Service": {"service": "Google Calendar", "service_id": 2, "type": "create_event"},
            "Params": {"summary": "string", "start_time": "string", "end_time": "string", "calendar_id": "string"}
        },

        # 3. YouTube
        {
            "name": "upload_video_from_URL",
            "description": "This action will publish a video or Short from a given URL to your YouTube channel.",
            "Service": {"service": "YouTube", "service_id": 3, "type": "upload_video"},
            "Params": {"video_url": "string", "title": "string", "description": "string"}
        },

        # 4. Outlook
        {
            "name": "send_mail",
            "description": "Send an email via Outlook API",
            "Service": {"service": "Outlook", "service_id": 4, "type": "send_email"},
            "Params": {"to": "string", "subject": "string", "body": "string"}
        },

        # 5. Microsoft Calendar
        {
            "name": "quick_add_event",
            "description": "This Action will add an event to your Google Calendar. Simply include a detailed description of when and what.", # Description says Google Calendar in service_script, but this is MS Calendar
            "Service": {"service": "Microsoft Calendar", "service_id": 5, "type": "quick_add"},
            "Params": {"text": "string", "calendar_id": "string"}
        },
        {
            "name": "create_a_detailed_event",
            "description": "This action will create a detailed event in your Google Calendar.", # Description says Google Calendar in service_script, but this is MS Calendar
            "Service": {"service": "Microsoft Calendar", "service_id": 5, "type": "create_event"},
            "Params": {"summary": "string", "start_time": "string", "end_time": "string", "calendar_id": "string"}
        },

        # 6. GitHub
        # No reactions defined in service_script.py for GitHub

        # 7. Discord
        {
            "name": "post_message",
            "description": "This action will send a message from the IFTTT Bot to the channel you specify.",
            "Service": {"service": "Discord", "service_id": 7, "type": "post_message"},
            "Params": {"channel_id": "string", "content": "string"}
        },

        # 8. LinkedIn
        {
            "name": "create_new_post",
            "description": "This action will create a new post on your LinkedIn profile.",
            "Service": {"service": "LinkedIn", "service_id": 8, "type": "newPost"},
            "Params": {"text": "string", "imageUrl": "string"}
        },

        # 9. Twitter
        {
            "name": "create_new_post_twitter",
            "description": "This action will create a new post on your Twitter profile.",
            "Service": {"service": "Twitter", "service_id": 10, "type": "newPost"},
            "Params": {"text": "string", "imageUrl": "string"}
        }
    ]
 
    for reaction in reactions:
        add_reaction(reaction)