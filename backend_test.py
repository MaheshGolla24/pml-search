import requests
import sys
from datetime import datetime

class PlanMyLuxeAPITester:
    def __init__(self, base_url="https://filter-results-dash.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if params:
            print(f"   Params: {params}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    json_data = response.json()
                    if isinstance(json_data, dict):
                        if 'total' in json_data:
                            print(f"   Total results: {json_data['total']}")
                        if 'hotels' in json_data:
                            print(f"   Hotels returned: {len(json_data['hotels'])}")
                        if 'destinations' in json_data:
                            print(f"   Destinations: {len(json_data['destinations'])}")
                        if 'holiday_types' in json_data:
                            print(f"   Holiday types: {len(json_data['holiday_types'])}")
                except:
                    pass
            else:
                self.tests_passed += 1 if response.status_code in [200, 201] else 0
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response text: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url
                })

            return success, response.json() if response.status_code in [200, 201] else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'url': url
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_filter_options(self):
        """Test filter options endpoint"""
        return self.run_test("Filter Options", "GET", "filter-options", 200)

    def test_search_all_hotels(self):
        """Test search endpoint without filters"""
        return self.run_test("Search All Hotels", "GET", "search", 200)

    def test_search_with_query(self):
        """Test search with query parameter"""
        return self.run_test("Search with Query", "GET", "search", 200, params={"q": "greece"})

    def test_search_by_destination(self):
        """Test search by destination filter"""
        return self.run_test("Search by Destination", "GET", "search", 200, params={"destinations": "greece"})

    def test_search_by_rating(self):
        """Test search by rating filter"""
        return self.run_test("Search by Rating", "GET", "search", 200, params={"rating": "5"})

    def test_search_by_holiday_type(self):
        """Test search by holiday type filter"""
        return self.run_test("Search by Holiday Type", "GET", "search", 200, params={"holiday_types": "all-inclusive"})

    def test_search_by_price_range(self):
        """Test search by price range"""
        return self.run_test("Search by Price Range", "GET", "search", 200, params={"price_min": 500, "price_max": 2000})

    def test_search_with_sort(self):
        """Test search with different sort options"""
        sort_options = ["best", "price_asc", "price_desc", "rating_desc", "newest"]
        for sort_option in sort_options:
            success, _ = self.run_test(f"Search Sort by {sort_option}", "GET", "search", 200, params={"sort": sort_option})
            if not success:
                return False
        return True

    def test_search_pagination(self):
        """Test search pagination"""
        success1, _ = self.run_test("Search Page 1", "GET", "search", 200, params={"page": 1, "page_size": 10})
        success2, _ = self.run_test("Search Page 2", "GET", "search", 200, params={"page": 2, "page_size": 10})
        return success1 and success2

    def test_search_combined_filters(self):
        """Test search with multiple filters combined"""
        return self.run_test("Search Combined Filters", "GET", "search", 200, params={
            "destinations": "greece",
            "rating": "5",
            "price_min": 1000,
            "sort": "price_asc"
        })

def main():
    print("🚀 Starting PlanMyLuxe API Testing...")
    print("=" * 60)
    
    # Setup
    tester = PlanMyLuxeAPITester()

    # Run all tests
    test_methods = [
        tester.test_health_check,
        tester.test_filter_options,
        tester.test_search_all_hotels,
        tester.test_search_with_query,
        tester.test_search_by_destination,
        tester.test_search_by_rating,
        tester.test_search_by_holiday_type,
        tester.test_search_by_price_range,
        tester.test_search_with_sort,
        tester.test_search_pagination,
        tester.test_search_combined_filters,
    ]

    for test_method in test_methods:
        try:
            test_method()
        except Exception as e:
            print(f"❌ Test {test_method.__name__} failed with exception: {e}")

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for failed in tester.failed_tests:
            error_msg = failed.get('error', f"Expected {failed.get('expected')}, got {failed.get('actual')}")
            print(f"   - {failed['name']}: {error_msg}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())