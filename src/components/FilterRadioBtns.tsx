import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { COLORS } from 'services/constants';
interface optionItem {
    key: string
    value: string
}
type filterBtnsProps = {
    filterByStatus: string
    setFilterByStatus: Function
}
export default function FilterRadioBtns({ filterByStatus, setFilterByStatus }: filterBtnsProps) {
    const [options, setOptions] = React.useState<optionItem[]>([])
    React.useEffect(() => {
        printObject(COLORS)
    }, [])
    const printObject = (obj: Record<string, any>) => {
        let items: Array<optionItem> = [];
        for (const [key, value] of Object.entries(obj)) {
            let item: optionItem = {
                key: key,
                value: value
            }
            items.push(item)
        }
        setOptions(items)
    }

    const options_component = options.map(option => {
        return (
            <FormControlLabel key={option.key} value={option.key} control={<Radio />} label={option.key} />
        )
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterByStatus((event.target as HTMLInputElement).value);
    };

    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleChange}
                value={filterByStatus}
            >
                <FormControlLabel value={''} control={<Radio />} label={'ALL'} />
                {options_component}
            </RadioGroup>
        </FormControl>
    );
}