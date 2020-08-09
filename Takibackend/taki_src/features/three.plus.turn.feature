Feature: three plus

  Scenario: plus three card
    Given a game with players:
    |player1|player2|player3|
    And it is "player1" turn, direction is "LEFT_TO_RIGHT"
    When "player1" places a plus three card on the table
    Then it is still "player1" turn. The following players need to take cards:
    |player2|3|
    |player3|3|
    When "player2" takes 2 cards from the pack
    Then it is still "player1" turn. The following players need to take cards:
    |player2|1|
    |player3|3|
    When "player3" takes 3 cards from the pack
    Then it is still "player1" turn. The following players need to take cards:
    |player2|1|
    When "player2" takes a card from the pack
    Then next player is "player2"

    Scenario: plus three card broken
    Given a game with players:
    |player1|player2|player3|
    And it is "player1" turn, direction is "LEFT_TO_RIGHT"
    When "player1" places a plus three card on the table
    Then it is still "player1" turn. The following players need to take cards:
    |player2|3|
    |player3|3|
    When "player2" suddenly comes up with a plus three break card and places it on the table
    Then it is still "player1" turn. The following players need to take cards:
    |player1|3|
    When "player1" takes 3 cards from the pack
    Then next player is "player2"

