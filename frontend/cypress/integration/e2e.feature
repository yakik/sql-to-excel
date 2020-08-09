Feature: Test this repository
 
  I want to be able to see list of commits, for each commitlist of diffs and see the entire source
  
  Scenario: 
    When I open the app
    And I select the repository "dev-process-analysis"
    And I load commitments
    And I select the commitment "refactor"