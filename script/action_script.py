import requests
import json
 
API_URL = "http://localhost:8080/api/action"  # adapte si nécessaire
 
def add_action(data):
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 201:
            print(f"✔ Action '{data['name']}' ajoutée avec succès.")
            print(json.dumps(response.json(), indent=4))
        else:
            print(f"❌ Erreur ({response.status_code}) pour '{data['name']}':")
            print(response.text)
    except Exception as e:
        print("❌ Exception :", e)
 
if __name__ == "__main__":
    actions = [

        # 2. Google Calendar
        {
            "name": "new_event_created",
            "description": "Triggered when a new event is added in the calendar",
            "Service": {"service": "Google Calendar", "service_id": 2, "type": "new_event"},
            "Params": {"calendar_id": "string"}
        },
        {
            "name": "event_started",
            "description": "Triggered when a new event starts in the calendar",
            "Service": {"service": "Google Calendar", "service_id": 2, "type": "event_start"},
            "Params": {"calendar_id": "string"}
        },
        {
            "name": "event_ended",
            "description": "Triggered when a new event ends in the calendar",
            "Service": {"service": "Google Calendar", "service_id": 2, "type": "event_end"},
            "Params": {"calendar_id": "string"}
        },

        # 3. YouTube
        {
            "name": "subscribe_to_a_channel",
            "description": "This trigger fires when a new subscription is made by you, or another specific channel.",
            "Service": {"service": "YouTube", "service_id": 3, "type": "subscribe"},
            "Params": {"channel_id": "string"}
        },
        {
            "name": "public_video_from_subscriptions",
            "description": "This Trigger fires every time a specific user you are subscribed to makes a new video public.",
            "Service": {"service": "YouTube", "service_id": 3, "type": "new_video_sub"},
            "Params": {"channel_id": "string"}
        },

        # 4. Outlook
        {
            "name": "receive_new_mail",
            "description": "Triggered when a New mail is received by the user",
            "Service": {"service": "Outlook", "service_id": 4, "type": "receive_mail"},
            "Params": {"folder_id": "string"}
        },
        {
            "name": "new_mail_with_keyword",
            "description": "Triggered when a user receive a new mail with a special keyword inside",
            "Service": {"service": "Outlook", "service_id": 4, "type": "keyword_mail"},
            "Params": {"keyword": "string"}
        },
        {
            "name": "event_start_in_w_time",
            "description": "Triggered when an event start in X time",
            "Service": {"service": "Outlook", "service_id": 4, "type": "event_reminder"},
            "Params": {"time_before": "integer"}
        },

        # 5. Microsoft Calendar
        {
            "name": "new_event_created",
            "description": "Triggered when a new event is added in the calendar",
            "Service": {"service": "Microsoft Calendar", "service_id": 5, "type": "new_event"},
            "Params": {"calendar_id": "string"}
        },
        {
            "name": "event_started",
            "description": "Triggered when a new event starts in the calendar",
            "Service": {"service": "Microsoft Calendar", "service_id": 5, "type": "event_start"},
            "Params": {"calendar_id": "string"}
        },
        {
            "name": "event_ended",
            "description": "Triggered when a new event ends in the calendar",
            "Service": {"service": "Microsoft Calendar", "service_id": 5, "type": "event_end"},
            "Params": {"calendar_id": "string"}
        },

        # Github
        {
            "name": "github_new_repo",
            "description": "Triggered when the user creates a new GitHub repository",
            "Service": {"service": "Github", "service_id": 6, "type": "repo"},
            "Params": {
                "repo": "string",
                "private": "boolean"
            }
        },
        {
            "name": "github_new_push",
            "description": "Triggered when a user pushes to a GitHub repository",
            "Service": {"service": "Github", "service_id": 6, "type": "push"},
            "Params": {
                "repo": "string"
            }
        },
        {
            "name": "github_new_issue",
            "description": "Triggered when a new issue is created in a repository",
            "Service": {"service": "Github", "service_id": 6, "type": "issue"},
            "Params": {
                "repo": "string",
                "issue_title": "string"
            }
        },

        # 8. LinkedIn
        {
            "name": "new_post",
            "description": "This triggered when a new post is created",
            "Service": {"service": "LinkedIn", "service_id": 8, "type": "new_post"},
            "Params": {}
        },
        {
            "name": "new_comment",
            "description": "This triggered when a new comment is created",
            "Service": {"service": "LinkedIn", "service_id": 8, "type": "new_comment"},
            "Params": {}
        },
        {
            "name": "new_connection",
            "description": "This triggered when a new connection is created",
            "Service": {"service": "LinkedIn", "service_id": 8, "type": "new_connection"},
            "Params": {}
        },

        # 9. Timer
        {
            "name": "countdown_finished",
            "description": "This triggered when a countdown finishes",
            "Service": {"service": "Timer", "service_id": 9, "type": "countdown"},
            "Params": {"duration": "integer"}
        },
        {
            "name": "every_x_minutes",
            "description": "This triggered every X minutes",
            "Service": {"service": "Timer", "service_id": 9, "type": "interval"},
            "Params": {"minutes": "integer"}
        },
        {
            "name": "specific_date",
            "description": "This triggered on a specific date",
            "Service": {"service": "Timer", "service_id": 9, "type": "date"},
            "Params": {"date_time": "string"}
        },

        # 10. X (Twitter)
        {
            "name": "new_tweet_by_you",
            "description": "This Trigger fires every time you post a new tweet.",
            "Service": {"service": "X (Twitter)", "service_id": 10, "type": "new_tweet"},
            "Params": {}
        },
        {
            "name": "new_liked_tweet_by_you",
            "description": "This Trigger fires every time you like a tweet.",
            "Service": {"service": "X (Twitter)", "service_id": 10, "type": "liked_tweet"},
            "Params": {}
        },
        {
            "name": "new_follower",
            "description": "This Trigger fires every time a new user starts following you.",
            "Service": {"service": "X (Twitter)", "service_id": 10, "type": "new_follower"},
            "Params": {}
        },
        {
            "name": "new_tweet__from_user",
            "description": "This Trigger fires every time a new user post a tweet.",
            "Service": {"service": "Twitter", "service_id": 10, "type": "New_tweet"},
            "Params": {"username": "string"}
        },

        # 11. Twitch
        {
            "name": "stream_going_live",
            "description": "This Trigger fires every time a stream is going live for the specified Channel that you follow.",
            "Service": {"service": "Twitch", "service_id": 11, "type": "stream_live"},
            "Params": {"channel_name": "string"}
        },
        {
            "name": "new_video_posted_by_a_channel",
            "description": "This trigger fires every time there is a new video posted by a channel you follow.",
            "Service": {"service": "Twitch", "service_id": 11, "type": "new_video"},
            "Params": {"channel_name": "string"}
        },
        {
            "name": "follow_a_new_channel",
            "description": "This trigger fires every time you follow a new channel on Twitch.",
            "Service": {"service": "Twitch", "service_id": 11, "type": "new_follow"},
            "Params": {}
        },

        #gmail
        {
            "name": "new_mail",
            "description": "receive a new mail in inbox",
            "Service": {"service": "Gmail", "service_id": 1, "type": "receiveMail"},
            "Params": {
                "from": "string",
            }
        }
    ]
 
    for action in actions:
        add_action(action)