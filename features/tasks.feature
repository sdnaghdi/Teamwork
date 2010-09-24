Feature: Tasks

  Scenario: Create a new task
    Given I am on the new task page
    And I fill in ""
    When I create a task named "A new task"
    Then I should see "A new task"
