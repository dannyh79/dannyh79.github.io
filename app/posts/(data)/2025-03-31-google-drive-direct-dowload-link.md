---
title: 'Get Direct Download Link for Google Drive Files'
summary: 'The way to get the direct download link of public files from Google Drive.'
createdAt: 2025-03-31 00:57:17 +0800
publishedAt: 2025-03-31
categories: [misc, gcp]
---

## TLDR

Use the below URL formats to share (public) file download links that skip Google Drive UI with someone:

- For Google Docs, use `https://docs.google.com/document/d/FILE_ID/export?format=FORMAT`

  - Supported formats
    - `pdf`
    - `docx`
    - `txt`
    - `html`

- For Google Sheets, use `https://docs.google.com/spreadsheets/d/FILE_ID/export?format=FORMAT`

  - Supported formats
    - `pdf`
    - `xlsx`
    - `csv` (for a single sheet)
    - `zip` (for multiple sheets as CSVs)

- For any other files, use `https://drive.google.com/uc?export=download&id=FILE_ID`

## Retrieve the `FILE_ID`

1. Copy the share link to the file. It should look like

   - https://docs.google.com/document/d/1a2b3c4D5eFGhijk1234567890/edit?usp=sharing (Google Docs)
   - https://docs.google.com/spreadsheets/d/1a2b3c4D5eFGhijk1234567890/edit?usp=sharing (Google Sheets)
   - https://drive.google.com/file/d/1a2b3c4D5eFGhijk/view?usp=sharing (for any other files)

2. The `1a2b3c4D5eFGhijk` will be the file ID

## Assemble the Link

Replace the `FILE_ID` and `FORMAT` (only needed for Google Docs / Google Sheets) from the link template in [TDLR](#tldr). Voilà!
