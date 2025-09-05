# Android XR Deep Link
Add to your Android XR viewer to handle `voluspherexr://open?expId=...`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="voluspherexr" android:host="open" />
</intent-filter>
```

Fetch manifest:
```
GET https://YOUR_API_HOST/manifests/{expId}.json
```
Then load assets in your XR engine.
