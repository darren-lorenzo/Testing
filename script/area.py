import requests
import json

API_URL = "http://localhost:8080/api/templates"
HEADERS = {"Content-Type": "application/json"}

templates = [
    {
        "name": "Notification Email pour Nouveau Repo GitHub",
        "description": "Recevoir un email Gmail quand vous créez un nouveau dépôt GitHub",
        "action_id": 12,  # github_new_repo
        "reaction_id": 1,  # send_gmail
        "category": "notifications",
        "Params": {
            "action": {
                "github": {
                    "username": "string",
                    "repo": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Nouveau dépôt GitHub créé",
                    "body": "Vous avez créé un nouveau dépôt"
                }
            }
        },
        "services": ["github", "gmail"]
    },
    {
        "name": "Email vers Outlook depuis GitHub Issue",
        "description": "Envoyer un email Outlook quand une issue GitHub est créée",
        "action_id": 4,  # github_new_issue
        "reaction_id": 2,  # send_gmail (adapter selon votre système)
        "category": "productivity",
        "Params": {
            "action": {
                "github": {
                    "repo": "string",
                    "issue_title": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Nouvelle issue GitHub",
                    "body": "Une nouvelle issue a été créée"
                }
            }
        },
        "services": ["github", "gmail"]
    },
    {
        "name": "Email Gmail reçu vers Brouillon",
        "description": "Créer automatiquement un brouillon Gmail pour chaque email reçu d'un expéditeur spécifique",
        "action_id": 1,  # gmail_receive
        "reaction_id": 5,  # brouillon_gmail
        "category": "automation",
        "Params": {
            "action": {
                "gmail": {
                    "from": "string",
                    "subject": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Re:",
                    "body": "Brouillon automatique créé pour répondre à cet email."
                }
            }
        },
        "services": ["gmail", "gmail"]
    },
    {
        "name": "Marquer Email Important comme Favori",
        "description": "Ajouter une étoile aux emails Gmail reçus d'un expéditeur important",
        "action_id": 1,  # gmail_receive
        "reaction_id": 3,  # star_gmail
        "category": "productivity",
        "Params": {
            "action": {
                "gmail": {
                    "from": "string",
                    "subject": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "from": "string",
                    "subject": "string"
                }
            }
        },
        "services": ["gmail", "gmail"]
    },
    {
        "name": "Notification Push GitHub vers Email",
        "description": "Recevoir un email à chaque push sur un dépôt GitHub",
        "action_id": 10,  # github_new_push
        "reaction_id": 1,  # send_gmail
        "category": "notifications",
        "Params": {
            "action": {
                "github": {
                    "repo": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Nouveau push",
                    "body": "Un nouveau commit a été poussé sur votre dépôt"
                }
            }
        },
        "services": ["github", "gmail"]
    },
    {
        "name": "Rappel Événement Outlook",
        "description": "Recevoir un email Gmail 10 minutes avant un événement Outlook",
        "action_id": 9,  # event_start_in_xtime
        "reaction_id": 2,  # send_gmail
        "category": "reminders",
        "Params": {
            "action": {
                "outlook": {
                    "minutesBefore": 10
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Rappel : Événement imminent",
                    "body": "Votre événement commence dans 10 minutes"
                }
            }
        },
        "services": ["outlook", "gmail"]
    },
    {
        "name": "Nettoyage Auto Email",
        "description": "Supprimer automatiquement les emails d'un expéditeur spécifique",
        "action_id": 1,  # gmail_receive
        "reaction_id": 4,  # delete_gmail
        "category": "automation",
        "Params": {
            "action": {
                "gmail": {
                    "from": "string",
                    "subject": "string"
                }
            },
            "reaction": {
                "gmail": {
                    "from": "string",
                    "subject": "string"
                }
            }
        },
        "services": ["gmail", "gmail"]
    },
    {
        "name": "Nouveau Mail Outlook vers Gmail",
        "description": "Transférer les nouveaux emails Outlook vers Gmail",
        "action_id": 7,  # receive_new_mail
        "reaction_id": 2,  # send_gmail
        "category": "notifications",
        "Params": {
            "action": {
                "outlook": {
                    "folder": "Inbox"
                }
            },
            "reaction": {
                "gmail": {
                    "to": "string",
                    "subject": "Nouveau mail Outlook",
                    "body": "Vous avez reçu un nouveau mail sur Outlook"
                }
            }
        },
        "services": ["outlook", "gmail"]
    }
]

def populate_templates():
    for template in templates:
        try:
            res = requests.post(API_URL, json=template, headers=HEADERS, timeout=10)
            res.raise_for_status()
            print(f"✅ Template créé : {template['name']}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Erreur pour {template['name']} : {e}")

if __name__ == "__main__":
    populate_templates()