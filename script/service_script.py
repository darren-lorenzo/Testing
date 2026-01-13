import requests
import json

API_URL = "http://localhost:8080/api/service"  # Change si besoin

def add_service(data):
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 201:
            print(f"✔ Service '{data['name']}' ajouté avec succès.")
            print(json.dumps(response.json(), indent=4))
        else:
            print(f"❌ Erreur ({response.status_code}) pour '{data['name']}':")
            print(response.text)
    except Exception as e:
        print("❌ Exception :", e)

if __name__ == "__main__":
    services = [
        #1. Gmail
        {
            "name": "Gmail",
            "service": "google",
            "description": "Gestion des emails via Google.",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
            "color": "#EA4335",
            "actions": [
            ],
            "reactions": [
                {"name": "send_gmail", "description": "Send an email via Gmail API"},
                {"name": "star_gmail", "description": "Mark the email as read"},
                {"name": "delete_gmail", "description": "Save email attachment to Google Drive"},
                {"name": "brouillon_gmail", "description": "Save email attachment pto Google Drive"},
            ]
        },
 
        #2. Google Calendar
        {
            "name": "Google Calendar",
            "service": "google",
            "description": "Gestion des événements et agendas.",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
            "color": "#4285F4",
            "actions": [
                {"name": "new_event_created", "description": "Triggerd when a new event is add in the calendar"},
                {"name": "event_started", "description": "Triggerd when a new event start in the calendar"},
                {"name": "event_ended", "description": "Triggerd when a new event end in the calendar"},
            ],
            "reactions": [
                {"name": "quick_add_event", "description": "This Action will add an event to your Google Calendar. Simply include a detailed description of when and what."},
                {"name": "create_a_detailed_event", "description": "This action will create a detailed event in your Google Calendar."},
            ]
        },
        #3. YouTube
        {
            "name": "YouTube",
            "service": "google",
            "description": "Plateforme vidéo et streaming.",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
            "color": "#FF0000",
            "actions": [
                {"name": "subscribe_to_a_channel", "description": " This trigger fires when a new subscription is made by you, or another specific channel."},
                {"name": "public_video_from_subscriptions", "description": "This Trigger fires every time a specific user you are subscribed to makes a new video public."},
            ],
            "reactions": [
                {"name": "upload_video_from_URL", "description": "This action will publish a video or Short from a given URL to your YouTube channel. Video will be uploaded as a Short or regular video based on the video length and aspect ratio."},
            ]
        },
 
        #4. Outlook
        {
            "name": "Outlook",
            "service": "microsoft",
            "description": "Service de messagerie Microsoft.",
            "logo": "https://static.cdnlogo.com/logos/m/25/microsoft-outlook.svg",
            "color": "#0078D4",
            "actions": [
                {"name": "receive_new_mail", "description": "Triggered when a New mail is received by the user"},
                {"name": "new_mail_with_keyword", "description": "Triggered when a user receive a new mail with a special keyword inside"},
                {"name": "event_start_in_w_time", "description": "Triggered when an event start in X time"}
            ],
            "reactions": [
                {"name": "send_mail", "description": "Send an email via Outlook API"},
            ]
        },
 
        #5. Microsoft Calendar
        {
            "name": "Microsoft Calendar",
            "service": "microsoft",
            "description": "Calendrier Outlook et événements.",
            "logo": "https://cdn.jsdelivr.net/gh/microsoft/fluentui-system-icons@main/assets/Calendar/SVG/ic_fluent_calendar_48_color.svg%22",
            "color": "#2D7D9A",
            "actions": [
                {"name": "new_event_created", "description": "Triggerd when a new event is add in the calendar"},
                {"name": "event_started", "description": "Triggerd when a new event start in the calendar"},
                {"name": "event_ended", "description": "Triggerd when a new event end in the calendar"},
            ],
            "reactions": [
                {"name": "quick_add_event", "description": "This Action will add an event to your Google Calendar. Simply include a detailed description of when and what."},
                {"name": "create_a_detailed_event", "description": "This action will create a detailed event in your Google Calendar."},
            ]
        },
 
        #6. GitHub
        {
            "name": "GitHub",
            "service": "github",
            "description": "Hébergement de code et gestion de versions.",
            "logo": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            "color": "#181717",
            "actions": [
                {"name": "github_new_repo", "description": "Triggered when the user creates a new GitHub repository"},
                {"name": "github_new_push", "description": "Triggered when a user pushes to a GitHub repository"},
                {"name": "github_new_issue", "description": "Triggered when a new issue is created in a repository"}
            ],
            "reactions": [
            ]
        },
 
        #7. Discord
        {
            "name": "Discord",
            "service": "discord",
            "description": "Messagerie instantanée et VoIP.",
            "logo": "https://cdn.simpleicons.org/discord/5865F2",
            "color": "#5865F2",
            "actions": [
                {"name": "new_message", "description": " This trigger fires when a new message is posted in a channel you select."},
            ],
            "reactions": [
                {"name": "post_message", "description": "This action will send a message from the IFTTT Bot to the channel you specify."},                
            ]
        },
        #8. LinkedIn
 
        {
            "name": "LinkedIn",
            "service": "linkedin",
            "description": "Réseau social professionnel.",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
            "color": "#0A66C2",
            "actions": [
            ],
            "reactions": [
                {"name": "share_an_update", "description": "This action will share a text update on your LinkedIn profile."},
            ]
        },
 
        #9. Timer
        {
            "name": "Timer",
            "service": "timer",
            "description": "Planification temporelle et tâches Cron.",
            "logo": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/clockify.svg",
            "color": "#0FE624",
            "actions": [
                {"name": "countdown_finished", "description": "This triggerd when"},
                {"name": "every_x_minutes", "description": "This triggerd when"},
                {"name": "specific_date", "description": "This triggerd when"},
            ],
            "reactions": [
            ]
        },
        
        #10. X (Twitter)
        {
            "name": "X (Twitter)",
            "service": "twitter",
            "description": "Automate your LinkedIn integrations",
            "logo": "https://cdn.simpleicons.org/x/000000",
            "color": "#000000",
            "actions": [
                {"name": "new_tweet_by_you", "description": "This Trigger fires every time you post a new tweet."},
                {"name": "new_liked_tweet_by_you", "description": "This Trigger fires every time you like a tweet."},
                {"name": "new_follower", "description": "This Trigger fires every time a new user starts following you."},
            ],
            "reactions": [
                {"name": "post_a_tweetr", "description": "This Action will post a new tweet to your Twitter account. NOTE: Please adhere to Twitter's Rules and Terms of Service."} 
            ]
        },
        
        #11. Twitch
        {
            "name": "Twitch",
            "service": "twitch",
            "description": "Automate your Twitch integrations",
            "logo": "https://cdn.simpleicons.org/twitch/9146FF",
            "color": "#9F0DE8",
            "actions": [
                {"name": "stream_going_live", "description": "This Trigger fires every time a stream is going live for the specified Channel that you follow."},
                {"name": "new_video_posted_by_a_channel", "description": "This trigger fires every time there is a new video posted by a channel you follow."},
                {"name": "follow_a_new_channel", "description": "This trigger fires every time you follow a new channel on Twitch."},
            ],
            "reactions": [
            ]
        }
    ]
 
    for service in services:
        add_service(service)
