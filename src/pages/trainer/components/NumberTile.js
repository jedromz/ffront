import React from 'react';
import { Link } from 'react-router-dom';

function NumberTile({ number, label, to }) {
    return (
        <div className="bg-gray-300 flex flex-col justify-center items-center rounded hover:bg-gray-400 h-72 w-72">
            <Link to={to} className="text-center">
                <div className="text-6xl font-bold">{number}</div> {/* Big and bold number */}
                <div className="text-xl mt-4">{label}</div> {/* Label below the number */}
            </Link>
        </div>
    );
}

export default NumberTile;
