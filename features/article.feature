Feature: Article Management

  @positive @create
  Scenario: Successfully create a new article
    Given the user navigates to the article editor page
    When the user creates a new article with valid data
    Then the user should see the newly created article page with matching title and body
    And the article should exist in the system backend

  @negative @create
  Scenario: Show validation error when publishing without required fields
    Given the user navigates to the article editor page
    When the user clicks publish without filling any fields
    Then a validation error message should be displayed
    And the user should remain on the editor page

  @positive @edit
  Scenario: Successfully edit an existing article
    Given an article exists in the system
    When the user navigates to edit the article
    And the user updates the title and body with new values
    Then the article page should display the updated title and body

  @negative @edit
  Scenario: Do not update article when title is cleared
    Given an article exists in the system
    When the user navigates to edit the article
    And the user clears the title and attempts to publish
    Then the article title should remain unchanged

  @positive @delete
  Scenario: Successfully delete an article
    Given an article exists in the system
    When the user views the article and clicks delete
    Then the user should be redirected to the home page
    And the article should no longer exist in the system backend

  @positive @filter
  Scenario: Filter articles by tag successfully
    Given an article exists with tag "Bondar Academy"
    When the user navigates to the home page
    And the user filters articles by tag "Bondar Academy"
    Then the article should be visible in the filtered feed
