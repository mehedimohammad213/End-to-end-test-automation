Feature: User Settings Management

  @positive @settings
  Scenario: Update user profile bio
    Given the user navigates to the settings page
    When the user updates their bio with new test data
    Then the user should be redirected to their profile page
    And the updated bio should be displayed on the profile page

  @negative @settings
  Scenario: Block settings access after logout
    Given the user navigates to the settings page
    When the user clicks the logout button
    Then the user should be redirected to the home page
    And accessing the settings page should redirect away and prompt for sign in
