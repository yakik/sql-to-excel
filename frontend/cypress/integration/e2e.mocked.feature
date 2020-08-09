Feature: With Mocks
 
  I want to be able to see list of commits, for each commitlist of diffs and see the entire source
  
  Scenario: 
    Given I am working with mocks
    And repositories are mocked
    And commitments are mocked
    And diffs are mocked
    When I open the app
    And I select the repository "mock-repository"
    And I load commitments
    And I select the commitment "my first commit"
    And I select the diff "(A)~/dev/myChange/file_B.py"
    #Then I click the "load repositories" button
    # Then I see a list of sources
    # When I select the source XXXX
    # Then I see a list of commits
    # When I select commit YYYY
    # Then I see a list of Diffs
    # When I click Diff ZZZZ
    # Then I see the source with indication of changes
    # And  I see a summary of the Diffעןא דאש