/**
 * SETUP GUIDE: AllVacationDealsPage Integration
 * 
 * This guide shows how to integrate the AllVacationDealsPage into your React Router setup
 */

// ============================================================================
// OPTION 1: React Router Setup (Current Structure)
// ============================================================================

// In your main routing file (e.g., App.js or router.js):

import AllVacationDealsPage from '@/pages/AllVacationDealsPage';

const routes = [
  {
    path: '/all-vacation-deals',
    element: <AllVacationDealsPage />,
  },
  // ...other routes
];

// Or with React Router v6:
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'all-vacation-deals',
        element: <AllVacationDealsPage />,
      },
      // ...other routes
    ],
  },
]);

// ============================================================================
// OPTION 2: Update Navigation Links
// ============================================================================

// Update any navigation/menu links to point to the vacation deals page:

import { Link } from 'react-router-dom';

export function Header() {
  return (
    <nav>
      <Link to="/all-vacation-deals">Vacation Deals</Link>
      {/* ...other nav items */}
    </nav>
  );
}

// ============================================================================
// OPTION 3: Page URL Mapping
// ============================================================================

// Map these URLs in your routing:
// - /all-vacation-deals → AllVacationDealsPage

// ============================================================================
// API ENDPOINTS REQUIRED
// ============================================================================

// The page expects these API endpoints to exist:

// 1. GET /api/vacation-deals
//    Query parameters:
//    - q: search query string
//    - destinations: comma-separated destination names
//    - holiday_types: comma-separated holiday type slugs
//
//    Response:
//    {
//      "deals": [
//        {
//          "id": 1,
//          "slug": "maldives-beach-resort",
//          "name": "Maldives Beach Resort",
//          "title": "Luxury Beach Resort",
//          "location": "Maldives",
//          "property_rating": "4.5",
//          "card_image": "https://...",
//          "offer_tag_type": "https://...",
//          "offer_on_card": "20% OFF",
//          "info_paragraph": "All-inclusive package with flights",
//          "intro_text": "Experience paradise",
//          "extras": "5 nights, flights included",
//          "starting_price": "£1,299",
//          "api_url": "https://example.com/deals/maldives-resort"
//        }
//      ],
//      "total": 42
//    }

// 2. GET /api/vacation-deals/options
//
//    Response:
//    {
//      "destinations": [
//        {
//          "href": "/vacations/maldives",
//          "label": "Maldives",
//          "count": 15
//        },
//        {
//          "href": "/vacations/bali",
//          "label": "Bali",
//          "count": 8
//        }
//      ],
//      "holiday_types": [
//        {
//          "label": "Beach Resorts",
//          "slug": "beach-resorts"
//        },
//        {
//          "label": "Adventure Trips",
//          "slug": "adventure-trips"
//        }
//      ]
//    }

// ============================================================================
// COMPONENT HIERARCHY
// ============================================================================

// AllVacationDealsPage
// ├── BreadcrumbBar
// ├── AllVacationDealsSearchBar
// │   ├── SearchField (Destination)
// │   ├── SearchField (Deal Type)
// │   └── SearchButton
// └── AllVacationDealsResultsSection
//     ├── FiltersSidebar
//     │   ├── PriceRangeFilter
//     │   ├── RatingFilter
//     │   ├── DestinationFilter
//     │   └── HolidayTypeFilter
//     ├── ResultsHeader
//     └── DealCard[] (grid of deals)

// ============================================================================
// STATE FLOW
// ============================================================================

// 1. User enters search criteria in AllVacationDealsSearchBar
// 2. onSearch callback triggered with { query, destinations, holidayTypes }
// 3. SearchParams state updated in AllVacationDealsPage
// 4. useEffect fetches data from /api/vacation-deals
// 5. Results displayed in AllVacationDealsResultsSection
// 6. User can filter/sort within ResultsSection (client-side only)

// ============================================================================
// CUSTOMIZATION OPTIONS
// ============================================================================

// Modify API endpoints by updating the fetch URLs in AllVacationDealsPage:

const dealsResponse = await fetch(
  `/api/vacation-deals?${new URLSearchParams({...}).toString()}`
);

// Change breadcrumb link:
<a href="/somewhere-else" className="...">Home</a>

// Modify page title in BreadcrumbBar:
<span>Your Custom Title</span>

// ============================================================================
// ENVIRONMENT VARIABLES (Optional)
// ============================================================================

// Add to .env.local if using custom API base URL:
// REACT_APP_API_BASE_URL=https://api.example.com

// Then update fetch calls:
// const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
// fetch(`${baseUrl}/api/vacation-deals?...`)

export {};
