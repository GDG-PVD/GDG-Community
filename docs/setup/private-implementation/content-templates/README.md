# Chapter-Specific Content Templates

This guide explains how to create and manage content templates for your GDG chapter's private implementation.

## Template Structure

The Community Companion uses templates at multiple levels:

1. **Base Templates**: General social media format templates
2. **Event Templates**: Templates for different types of events
3. **Platform Templates**: Platform-specific post variations
4. **Brand Voice Templates**: Templates with chapter-specific voice and tone

## Content Templates Directory

Create a dedicated directory for your chapter's content templates:

```
/content-templates/
├── brand/
│   ├── voice.json       # Voice and tone guidelines
│   ├── hashtags.json    # Chapter-specific hashtags
│   └── images.json      # Brand image guidelines
├── events/
│   ├── workshop.json    # Workshop templates
│   ├── meetup.json      # Regular meetup templates
│   ├── hackathon.json   # Hackathon templates
│   └── io-extended.json # I/O Extended templates
└── platforms/
    ├── twitter.json     # Twitter-specific templates
    ├── linkedin.json    # LinkedIn-specific templates
    ├── facebook.json    # Facebook-specific templates
    └── discord.json     # Discord-specific templates
```

## Brand Voice Template

The brand voice template defines the overall tone and style for your chapter:

```json
{
  "voice": {
    "tone": "Friendly, approachable, technically precise",
    "personality_traits": [
      "Enthusiastic about technology",
      "Inclusive and welcoming",
      "Knowledgeable but not intimidating",
      "Community-focused"
    ],
    "style": {
      "sentence_length": "Mix of short and medium sentences. Avoid overly complex structures.",
      "paragraph_length": "Keep paragraphs brief, 2-3 sentences maximum for social media.",
      "technical_terms": "Use technical terms correctly but explain them when they might be unfamiliar.",
      "emoji_usage": "Use emojis sparingly to emphasize key points, not in every sentence."
    }
  },
  "chapter_specific": {
    "name_variations": [
      "GDG Providence",
      "GDG PVD",
      "Providence Google Developer Group"
    ],
    "location_references": [
      "in Providence",
      "in the Providence area",
      "in Rhode Island"
    ],
    "community_terms": [
      "PVD tech community",
      "Rhode Island developers",
      "local technologists"
    ]
  }
}
```

## Event Templates

Event templates provide structures for different event types:

```json
{
  "event_type": "workshop",
  "templates": {
    "announcement": {
      "title": "Workshop Announcement",
      "body": "Join us for our upcoming {{topic}} workshop! Learn how to {{learning_objective}} with hands-on exercises and expert guidance.\n\nDate: {{date}}\nTime: {{time}}\nLocation: {{location}}\n\nThis workshop is perfect for {{audience_level}} interested in {{topic}}. Bring your laptop and your curiosity!\n\nRegister now: {{registration_link}}",
      "variations": [
        "Get ready to level up your {{topic}} skills! Our upcoming workshop will teach you {{learning_objective}} through practical, hands-on learning.",
        "Calling all {{audience_level}} developers! Want to master {{topic}}? Join our interactive workshop to learn {{learning_objective}}."
      ]
    },
    "reminder": {
      "title": "Workshop Reminder",
      "body": "Don't forget! Our {{topic}} workshop is happening tomorrow at {{time}}. We'll be meeting at {{location}}.\n\nMake sure to bring your laptop and install the prerequisites: {{prerequisites}}.\n\nWe're looking forward to seeing you there!",
      "timing": "1 day before event"
    },
    "recap": {
      "title": "Workshop Recap",
      "body": "Thanks to everyone who attended our {{topic}} workshop! We had {{attendee_count}} attendees learning about {{learning_objective}}.\n\nSpecial thanks to {{instructor}} for leading the session and sharing their expertise.\n\nMissed it? Check out the materials here: {{materials_link}}\n\nStay tuned for our next event!",
      "timing": "1 day after event"
    }
  }
}
```

## Platform-Specific Templates

Different platforms require different formats:

```json
{
  "platform": "twitter",
  "constraints": {
    "max_length": 280,
    "media_count": 4,
    "hashtag_limit": 3
  },
  "templates": {
    "event_announcement": {
      "format": "🚀 {{event_type}} ALERT!\n\n{{event_title}} is coming on {{date}} at {{time}}.\n\n{{short_description}}\n\nRegister: {{short_link}}\n\n{{hashtags}}",
      "character_limit": 280,
      "hashtags": [
        "#GDGProvidence",
        "#{{event_topic}}Dev"
      ]
    },
    "event_reminder": {
      "format": "Reminder: Our {{event_type}} on {{event_title}} is TOMORROW at {{time}}!\n\nLocation: {{location}}\n\nLast chance to register: {{short_link}}\n\n{{hashtags}}",
      "character_limit": 280
    },
    "event_recap": {
      "format": "Thanks to everyone who joined our {{event_title}} {{event_type}} yesterday! {{outcome_highlight}}\n\nMissed it? {{followup_action}}: {{short_link}}\n\n{{hashtags}}",
      "character_limit": 280
    }
  }
}
```

## Implementing Templates in Firestore

Store your templates in Firestore for easy access:

1. Create a `templates` collection in Firestore
2. Upload each template as a document
3. Use subcollections for variations and platforms

Example Firestore structure:

```
/chapters/{chapterId}/
└── templates/
    ├── brand-voice/
    │   └── {voiceId}
    ├── events/
    │   ├── {eventType1}/
    │   │   ├── announcement
    │   │   ├── reminder
    │   │   └── recap
    │   └── {eventType2}/
    └── platforms/
        ├── twitter/
        ├── linkedin/
        └── facebook/
```

## Accessing Templates in Code

```python
def get_event_template(chapter_id, event_type, template_type, platform):
    """Get a template for a specific event type and platform."""
    db = firestore.Client()
    
    # Get the event template
    event_doc = db.collection('chapters').document(chapter_id) \
                  .collection('templates').document('events') \
                  .collection(event_type).document(template_type).get()
    
    if not event_doc.exists:
        return None
        
    event_template = event_doc.to_dict()
    
    # Get platform-specific formatting
    platform_doc = db.collection('chapters').document(chapter_id) \
                     .collection('templates').document('platforms') \
                     .collection(platform).document(event_type).get()
    
    if platform_doc.exists:
        platform_template = platform_doc.to_dict()
        # Merge the templates
        return {**event_template, "format": platform_template.get("format")}
    
    return event_template
```

## Template Versioning

Implement template versioning to track changes:

1. Add version and updated fields to templates
2. Store previous versions in a subcollection
3. Implement a template history viewer in the admin interface

Example versioned template:

```json
{
  "id": "workshop-announcement",
  "version": 3,
  "created_at": "2025-01-15T12:00:00Z",
  "updated_at": "2025-05-01T09:30:00Z",
  "updated_by": "organizer@example.com",
  "content": {
    "title": "Workshop Announcement",
    "body": "..."
  },
  "previous_versions": [
    {
      "version": 2,
      "updated_at": "2025-03-10T14:20:00Z",
      "updated_by": "organizer@example.com",
      "content": {
        "title": "Workshop Announcement",
        "body": "..."
      }
    },
    {
      "version": 1,
      "updated_at": "2025-01-15T12:00:00Z",
      "updated_by": "organizer@example.com",
      "content": {
        "title": "Workshop Announcement",
        "body": "..."
      }
    }
  ]
}
```

## Template Evaluation

Regularly review your templates based on performance metrics:

1. Track engagement metrics for posts using different templates
2. A/B test variations of templates
3. Update templates based on what performs best
4. Capture lessons learned in the Dynamic Layer of the knowledge management system

Create a template performance document:

```json
{
  "template_id": "workshop-announcement",
  "platform": "twitter",
  "performance": {
    "posts_using_template": 12,
    "average_engagement_rate": 3.2,
    "click_through_rate": 1.8,
    "best_performing_post_id": "post123",
    "worst_performing_post_id": "post456"
  },
  "lessons_learned": [
    "Posts with specific technology names in the first sentence perform better",
    "Including the time in addition to the date increases engagement",
    "Questions in the first line generate more replies"
  ]
}
```

## Template Migration

When creating a private implementation from the public template:

1. Start with the example templates provided in the public repo
2. Customize them for your chapter's voice and needs
3. Store them in your chapter's Firestore database
4. Create a template management UI for easy updates
