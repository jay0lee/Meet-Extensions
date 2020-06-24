# Google Meet Mass Mute
Chrome Extension to mute all meeting particpants other than self.

# Testing on one device
The extension is not published on the Chrome Web Store so it requires special steps to test:
1. Download [https://storage.googleapis.com/chrome-extensions-jay0lee/MeetMassMute/MeetMassMute.crx](https://storage.googleapis.com/chrome-extensions-jay0lee/MeetMassMute/MeetMassMute.crx?) (note, Chrome may give you trouble downloading in some cases for security reasons, try using another browser if so)
1. Go to `chrome://extensions` and enable developer mode at top right (note that this has nothing to do with Chrome OS developer mode).
1. From a file app, drag the `MeetMassMute.crx` file into the `chrome://extension` window. This should install the extension for the user. Note that if the user is locked down with Chrome policy this may not be allowed, try testing with a less locked down user.
1. Now assign a keyboard shortcut to mute everyone. Click the 3 bar "hamburger" menu at the top right in `chrome://extensions` and select Keyboard shortcuts. Set a shortcut for MeetMassMute "Mute all Google Meet participants" action. I recommend CTRL+ALT_M.
1. Start a meeting and have someone else join. To mute all participants, you can either press your keyboard shortcut CTRL+ALT+M or click the MeetMassMute icon and click the big red "Mute Everyone" button.

# Force installing the extension
1. Go to admin.google.com > 3 bar "hamburger" menu at top left.
1. Devices > Chrome > Apps > Users & browsers
1. Select the OrgUnit to the left you want to lockdown. This would generally be the Students OrgUnit. If you lockdown teachers they will be unable to manage students.
1. Click the yellow + circle at bottom right > click the "waffle" grid icon.
1. Change "From the Chrome Web Store" dropdown to "From a custom URL".
1. Enter `olknobpdecbmjgkbooekeikogfadpffb` for "Extension ID" field.
1. Enter `https://storage.googleapis.com/chrome-extensions-jay0lee/MeetMassMute/update.xml` for the URL field.
1. Click Save.
1. IMPORTANT: find the extension in the list and change it from "Allow install" to "Force install". Save changes.

# Limitations
1. The extension only works on Google Chrome. If user is using another browser, they won't have the extension and won't be able to mute all other participants.
