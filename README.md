# Google Hangouts Meet Student Lockdown
Chrome Extension to prevent users from kicking others out of the meeting, muting others and allowing users outside your G Suite domain into the meeting.

# Force Installing the Extension
1. Go to admin.google.com > 3 bar "hamburger" menu at top left.
1. Devices > Chrome > Apps > Users & browsers
1. Select the OrgUnit to the left you want to lockdown. This would generally be the Students OrgUnit. If you lockdown teachers they will be unable to manage students.
1. Click the yellow + circle at bottom right > click the "waffle" grid icon.
1. Change "From the Chrome Web Store" dropdown to "From a custom URL".
1. Enter `oakjbpajcldkbpfaopebjhmjafijdkfn` for "Extension ID" field.
1. Enter `https://storage.googleapis.com/chrome-extensions-jay0lee/MeetLockdown/update.xml` for the URL field.
1. Click Save.
1. IMPORTANT: find the extension in the list and change it from "Allow install" to "Force install". Save changes.
