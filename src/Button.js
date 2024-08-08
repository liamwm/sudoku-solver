function Button(props) {
    return (
        <button className="border-solid border-color-gray border-2 rounded-lg py-3" type="button" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default Button;