# Google Hangouts Meet student lockdown
Chrome Extension to prevent users from kicking others out of the meeting, muting others and allowing users outside your G Suite domain into the meeting. The extension is in early testing and is not yet recommended for mass deployment to end users.

# Testing on one device
The extension is not published on the Chrome Web Store so it requires special steps to test:
1. Download https://storage.googleapis.com/chrome-extensions-jay0lee/MeetLockdown/MeetLockdown.crx (note, Chrome may give you trouble downloading in some cases for security reasons, try using another browser if so)
1. Go to `chrome://extensions` and enable developer mode at top right (note that this has nothing to do with Chrome OS developer mode).
1. From a file app, drag the `MeetLockdown.crx` file into the `chrome://extension` window. This should install the extension for the user. Note that if the user is locked down with Chrome policy this may not be allowed, try testing with a less locked down user.

# Force installing the extension
1. Go to admin.google.com > 3 bar "hamburger" menu at top left.
1. Devices > Chrome > Apps > Users & browsers
1. Select the OrgUnit to the left you want to lockdown. This would generally be the Students OrgUnit. If you lockdown teachers they will be unable to manage students.
1. Click the yellow + circle at bottom right > click the "waffle" grid icon.
1. Change "From the Chrome Web Store" dropdown to "From a custom URL".
1. Enter `oakjbpajcldkbpfaopebjhmjafijdkfn` for "Extension ID" field.
1. Enter `https://storage.googleapis.com/chrome-extensions-jay0lee/MeetLockdown/update.xml` for the URL field.
1. Click Save.
1. IMPORTANT: find the extension in the list and change it from "Allow install" to "Force install". Save changes.

# How does the extension work?
1. When a user tries to mute, kick or allow an external user into an existing meeting, Chrome makes a HTTPS call to: `https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/UpdateMeetingDevice` and tells Google Meet to perform an action against the other user.
1. Unfortunately we can't simply block this URL because it's also used to update the user themselves when the user joins the room or performs other actions. If we block this URL, the user won't be able to join meetings at all.
1. Looking further, we can see Chrome is sending an HTTPS POST request to the UpdateMeetingDevice URL. The POST data includes an identifier telling us which device to update. It looks something like `spaces/<space id>/devices/<device id>`. The space_id is a unique identifier for this meeting and device id is a unique identifier for the joined user/device.
1. So our goal would be to allow HTTPS requests to `UpdateMeetingDevice` requests _if the user is updating their own device_ but block the requests if it's another user device. To do that we need to know which device id is this users.
1. Lucky for us as part of the process when the user joins a meeting, there's a request to `https://meet.google.com/$rpc/google.rtc.meetings.v1.MeetingDeviceService/CreateMeetingDevice`. We can observe this request and response and then whitelist the created device id for requests to `UpdateMeetingDevice`. In other words, users will be able to update device ids that they themselves created but not device ids for other users.
1. As a G Suite administrator, you have the ability to force install this extension for your users (see above). Users can't remove or disable force installed extensions. When you force install MeetLockdown for students but not staff/teachers, teachers will still be able to perform actions like mute, kick and accept external for other users but students won't.
  
# Limitations
1. The extension only works on Google Chrome. If user is using another browser, they won't have the extension and won't be locked down.
1. The extension does not work for users running the Android or iOS apps. Those users won't be locked down.
1. If the user is able to open developer tools, they'll be able to break the extension. You should ensure Chrome developer tools are disabled for all extensions or at least force installed extensions.
