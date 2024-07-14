import React from 'react';
import { Link } from 'react-router-dom';

function IconTile({ icon, label, to }) {
    return (
        <div className="bg-gray-300 p-4 flex justify-center items-center rounded hover:bg-gray-400 h-72 w-72">
            <Link to={to} className="text-center">
                <div className="text-6xl">{icon}</div> {/* Icon */}
                <div className="text-xl mt-4">{label}</div> {/* Label below the icon */}
            </Link>
        </div>
    );
}

export default IconTile;
