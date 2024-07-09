square_at(Puzzle, I-J, Value) :- 
    nth1(I, Puzzle, Row), 
    nth1(J, Row, Value).

filled_square_at(Puzzle, I-J, Value) :-
    square_at(Puzzle, I-J, Value1),
    nonvar(Value1),
    Value is Value1.

empty_square_at(Puzzle, I-J) :-
    square_at(Puzzle, I-J, Value),
    var(Value).

row_contains_value(Puzzle, I, Value) :-
    length(Puzzle, Size),
    between(1, Size, J),
    filled_square_at(Puzzle, I-J, Value).

column_contains_value(Puzzle, J, Value) :-
    length(Puzzle, Size),
    between(1, Size, I),
    filled_square_at(Puzzle, I-J, Value).

square_root(XRoot, X) :-
    between(1, X, XRoot),
    X is XRoot*XRoot,
    !.

pen_contains_value(Puzzle, I-J, Value) :-
    length(Puzzle, Size),
    square_root(RootSize, Size),
    RowMin is ((I-1) // RootSize) * RootSize + 1,
    RowMax is RowMin+RootSize-1,
    ColMin is ((J-1) // RootSize) * RootSize + 1,
    ColMax is ColMin+RootSize-1,
    between(RowMin, RowMax, PenI),
    between(ColMin, ColMax, PenJ),
    filled_square_at(Puzzle, PenI-PenJ, Value).


empty_coords(Puzzle, EmptiesCoords) :- findall(Coords, empty_square_at(Puzzle, Coords), EmptiesCoords).


possible_value(Puzzle, I-J, Value) :-
    length(Puzzle, Size),
    between(1, Size, Value),
    \+row_contains_value(Puzzle, I, Value),
    \+column_contains_value(Puzzle, J, Value),
    \+pen_contains_value(Puzzle, I-J, Value).

solve(Puzzle) :-
    empty_coords(Puzzle, Empties),
    solve(Puzzle, Empties).
solve(_, []).
solve(Puzzle, [Empty | Empties]) :-
    possible_value(Puzzle, Empty, PossibleValue),
    square_at(Puzzle, Empty, PossibleValue),
    solve(Puzzle, Empties).

puzzle(1, [
    [_, _, 6, 1, _, 2, 4, _, _], 
    [4, _, _, 5, _, _, _, _, 6], 
    [9, 1, _, 7, _, _, _, 8, 3], 
    [2, _, _, 9, _, 5, _, 7, _], 
    [_, _, _, _, _, _, _, _, 1], 
    [_, _, _, _, 8, _, 2, 4, _], 
    [6, 2, 9, 8, 7, _, 3, _, _], 
    [_, _, 8, 3, _, _, _, _, _], 
    [_, 7, _, 2, _, _, _, _, _]
]).

puzzle(2, [
    [1, _, _],
    [3, 2, _],
    [_, _, 3]
]).