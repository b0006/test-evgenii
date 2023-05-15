import { FC, ChangeEvent } from "react";
import debounce from "lodash.debounce";
interface SearchProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}
const Search: FC<SearchProps> = ({ setTitle }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);
  const debounceOnChange = debounce(handleChange, 500);
  return (
    <div>
      <input type="text" onChange={debounceOnChange} />
    </div>
  );
};
export default Search;
