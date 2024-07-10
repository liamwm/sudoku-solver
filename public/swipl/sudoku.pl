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

coords_in_same_pen(Puzzle, I-J, I2-J2) :-
    length(Puzzle, Size),
    square_root(RootSize, Size),
    between(1, Size, I),
    between(1, Size, J),
    RowMin is ((I-1) // RootSize) * RootSize + 1,
    RowMax is RowMin+RootSize-1,
    ColMin is ((J-1) // RootSize) * RootSize + 1,
    ColMax is ColMin+RootSize-1,
    between(RowMin, RowMax, I2),
    between(ColMin, ColMax, J2).

pen_contains_value(Puzzle, I-J, Value) :-
    coords_in_same_pen(Puzzle, I-J, PenI-PenJ),
    filled_square_at(Puzzle, PenI-PenJ, Value).

empty_coords(Puzzle, EmptiesCoords) :- findall(Coords, empty_square_at(Puzzle, Coords), EmptiesCoords).


possible_value(Puzzle, I-J, Value) :-
    length(Puzzle, Size),
    between(1, Size, Value),
    \+row_contains_value(Puzzle, I, Value),
    \+column_contains_value(Puzzle, J, Value),
    \+pen_contains_value(Puzzle, I-J, Value).

row_duplicates(Puzzle) :-
    filled_square_at(Puzzle, I1-J, Value),
    filled_square_at(Puzzle, I2-J, Value),
    I1 \= I2.

col_duplicates(Puzzle) :-
    filled_square_at(Puzzle, I-J1, Value),
    filled_square_at(Puzzle, I-J2, Value),
    J1 \= J2.

pen_duplicates(Puzzle) :-
    coords_in_same_pen(Puzzle, I1-J1, I2-J2),
    filled_square_at(Puzzle, I1-J1, Value),
    filled_square_at(Puzzle, I2-J2, Value),
    I1-J1 \= I2-J2,
    !.

no_duplicates(Puzzle) :- \+row_duplicates(Puzzle), \+col_duplicates(Puzzle), \+pen_duplicates(Puzzle).


solve(Puzzle) :-
    no_duplicates(Puzzle),
    empty_coords(Puzzle, Empties),
    solve(Puzzle, Empties).
solve(_, []).
solve(Puzzle, [Empty | Empties]) :-
    possible_value(Puzzle, Empty, PossibleValue),
    square_at(Puzzle, Empty, PossibleValue),
    solve(Puzzle, Empties).

% Examples
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