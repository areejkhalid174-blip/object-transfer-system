# Navigation Flow Test Guide

## Complete Flow: CustomerHome → PackageDetail → TrackOrder

### Step-by-Step Testing

#### 1. Start at CustomerHome
- Open the app
- You should see the Customer Home screen with categories

#### 2. Click on a Category (Food/Parcel/Groceries/Others)
- Click on any category card
- **Expected:** Navigate to PackageDetail screen

#### 3. Fill PackageDetail Form
- **Pickup Location:** Enter pickup address (e.g., "123 Main St")
- **Drop Location:** Enter drop address (e.g., "456 Park Ave")
- **Package Size:** Select Small/Medium/Large
- **Weight:** Enter weight in kg (e.g., "5")
- **Photo (Optional):** Add photo or skip
- **Notes (Optional):** Add notes or skip

#### 4. Click "Find Rider" Button
- After filling all required fields
- Click the blue "Find Rider" button at the bottom
- **Expected:** Navigate to TrackOrder screen ✅

---

## Navigation Structure

```
CustomerStack (Stack Navigator)
  ├─ CustomerHome (Tab Navigator)
  │   ├─ Home (DashboardScreen)
  │   ├─ MyOrders
  │   ├─ Chat
  │   ├─ Profile
  │   └─ Settings
  ├─ PackageDetail ← From category click
  └─ TrackOrder ← From "Find Rider" button
```

---

## Required Fields Validation

Before navigation to TrackOrder, these fields are validated:

1. ✅ Pickup Location (must not be empty)
2. ✅ Drop Location (must not be empty)
3. ✅ Package Size (must select one)
4. ✅ Weight (must not be empty)

If any field is missing, an error alert will show.

---

## Navigation Code

### CustomerHome → PackageDetail
```javascript
// From DashboardScreen category cards
navigation.navigate("PackageDetail", {
  categoryId: item.id,
  categoryName: item.title
});
```

### PackageDetail → TrackOrder
```javascript
// From "Find Rider" button
navigation.navigate("TrackOrder", {
  categoryId,
  categoryName,
  pickupLocation,
  dropLocation,
  packageType,
  weight,
  packagePhoto,
  additionalNotes,
});
```

---

## Troubleshooting

### Issue: Navigation not working from CustomerHome
**Solution:** 
- CustomerHome uses Tab Navigator inside Stack Navigator
- Use direct `navigation.navigate()` - already fixed ✅

### Issue: "Find Rider" button not responding
**Check:**
1. All required fields are filled
2. No validation errors
3. Console for any error messages

### Issue: TrackOrder screen not found
**Check:**
1. TrackOrder is imported in `app/index.js` ✅
2. TrackOrder is registered in CustomerStack ✅
3. Screen name matches exactly: "TrackOrder"

---

## Testing Checklist

- [ ] Open app and see CustomerHome
- [ ] Click on "Food" category
- [ ] PackageDetail screen opens
- [ ] Fill Pickup Location
- [ ] Fill Drop Location
- [ ] Select Package Size (Small/Medium/Large)
- [ ] Enter Weight
- [ ] Click "Find Rider" button
- [ ] TrackOrder screen opens ✅
- [ ] Verify all data is displayed correctly
- [ ] Test back navigation
- [ ] Test with different categories

---

## Current Status

✅ Navigation structure is correct
✅ All screens are registered
✅ Validation is working
✅ TrackOrder screen is created
✅ Data is passed correctly

**The navigation should work now!**

---

## Quick Test Command

1. Reload the app: Press `r` in Metro bundler
2. Or shake device → Reload
3. Or Ctrl+R (Android) / Cmd+R (iOS)

---

## Notes

- Navigation is simplified (removed try-catch complexity)
- All required screens are in CustomerStack
- Tab Navigator navigation is fixed
- Data flows correctly through all screens
