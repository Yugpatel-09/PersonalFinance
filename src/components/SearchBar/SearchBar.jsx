import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search transactions...' }) {
  return (
    <div className="search-bar">
      <RiSearchLine className="search-icon" size={17} />
      <input
        type="text"
        className="form-input search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear btn btn-ghost" onClick={() => onChange('')}>
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  );
}
