from playwright.sync_api import sync_playwright, Page, expect

def test_snake_game_navigation(page: Page):
    """
    This test verifies that a user can navigate from the home page
    to the snake game page by clicking the 'Play Snake' link.
    """
    # 1. Arrange: Go to the home page.
    page.goto("http://localhost:5173")

    # 2. Act: Find the "Play Snake" link and click it.
    snake_link = page.get_by_role("link", name="Play Snake")
    snake_link.click()

    # 3. Assert: Confirm the navigation was successful.
    # We expect the page to have a heading with the text "Snake Game".
    expect(page.get_by_role("heading", name="Snake Game")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/snake_game_page.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_snake_game_navigation(page)
        browser.close()

if __name__ == "__main__":
    main()
