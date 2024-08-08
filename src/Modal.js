function Modal(props) {
    const displayAttribute = props.enabled ? "block" : "hidden";
    return (
        <div className={`${displayAttribute} fixed w-screen h-screen bg-slate-950/60 z-50`}>
            <div className="bg-slate-100 rounded-md">
                <button className="size-12" type="button" onClick={props.onClose}>
                    <img src="assets/cross.svg" alt="Close" className=""/>
                </button>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;