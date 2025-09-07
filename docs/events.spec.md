# `data/events.json` Specification

This document describes the structure, fields, and intended usage of the `data/events.json` file, which contains a list of upcoming events for the Whenext application.

---

## Overview

- **Purpose:**  
  The file provides structured data about upcoming events in technology, gaming, and entertainment.  
  Each event includes metadata such as title, date, source, confidence score, and descriptive details.

- **Format:**  
  JSON array of event objects.

---

## Event Object Structure

Each event in the array is a JSON object with the following fields:

| Field             | Type     | Description                                                                                   | Example Value                                  |
|-------------------|----------|-----------------------------------------------------------------------------------------------|------------------------------------------------|
| `id`              | string   | Unique identifier for the event (URL-friendly, kebab-case recommended).                       | `"gta-6-release"`                              |
| `title`           | string   | Human-readable name of the event.                                                             | `"Grand Theft Auto VI"`                        |
| `source`          | string   | Name of the organization or entity providing the event information.                           | `"Rockstar Games"`                             |
| `source_url`      | string   | URL to the official source or announcement.                                                   | `"https://www.rockstargames.com/"`             |
| `event_date_iso`  | string   | ISO 8601 formatted date and time of the event (in UTC).                                       | `"2025-10-26T00:00:00Z"`                       |
| `timezone`        | string   | Timezone relevant to the event (abbreviation, e.g., PST, EST, JST, CET).                     | `"EST"`                                        |
| `unix_timestamp`  | integer  | Unix timestamp (seconds since epoch, UTC) for the event date/time.                            | `1761436800`                                   |
| `confidence`      | float    | Confidence score (0.0–1.0) indicating certainty of the event's date.                          | `0.75`                                         |
| `notes`           | string   | Additional notes, context, or rationale for the event date or confidence.                     | `"Estimated based on industry reports..."`      |
| `category`        | string   | Event category (e.g., `"tech"`, `"gaming"`, `"entertainment"`).                              | `"gaming"`                                     |
| `icon`            | string   | Icon identifier for UI display (e.g., Heroicons or custom icon names).                       | `"puzzle-piece"`                               |
| `description`     | string   | Brief description of the event.                                                               | `"The highly anticipated next installment..."`  |

---

## Example Event
