const Button = ({ text, onClick }) => {
    return (
        <button
            className="bg-amber-700 text-white px-4 py-2 rounded-xl font-bold text-sm cursor-pointer hover:border-white hover:border"
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button;
