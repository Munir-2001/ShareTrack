// config.js


export const fieldTypes = {
    text: 'text',
    number: 'number',
    textarea: 'textarea',
    switch: 'switch',
    select: 'select',
};

const availableCategories = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Accessories', 'Others'];
const availableCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Sheikhupura', 'Jhang', 'Rahim Yar Khan', 'Mardan', 'Kasur', 'Gujrat', 'Mingora', 'Dera Ghazi Khan', 'Nawabshah', 'Sahiwal', 'Mirpur Khas', 'Okara', 'Mandi Bahauddin', 'Jacobabad', 'Jhelum', 'Khanewal', 'Khairpur', 'Khuzdar', 'Dadu', 'Gojra', 'Mandi Bahauddin', 'Tando Allahyar', 'Daska', 'Pakpattan', 'Bahawalnagar', 'Tando Adam', 'Khushab', 'Badin', 'Lodhran', 'Kohat', 'Toba Tek Singh', 'Muzaffargarh', 'Nowshera', 'Chiniot', 'Dera Ismail Khan', 'Wazirabad', 'Kamalia', 'Umerkot', 'Chakwal', 'Shikarpur', 'Haroonabad', 'Larkana', 'Hafizabad', 'Lodhran', 'Kasur', 'Mianwali', 'Leiah', 'Kamoke', 'Khanpur', 'Attock', 'Swabi', 'Chishtian', 'Vehari', 'Kundian', 'Toba Tek Singh', 'Narowal'];
const availableStates = ['Sindh', 'Punjab', 'Balochistan', 'KPK', 'Gilgit Baltistan'];


export const formConfig = {
    initialStates: {
        name: '',
        description: '',
        price: '',
        category: '',
        city: 'Karachi',
        state: 'Sindh',
        country: 'Pakistan',
        isAvailable: true,
        availableDates: [],
    },
    formFields: [

        { key: 'name', label: 'Name', type: fieldTypes.text },
        { key: 'description', label: 'Description', type: fieldTypes.textarea },
        { key: 'price', label: 'Price', type: fieldTypes.number },
        { key: 'category', label: 'Category', type: fieldTypes.select, options: availableCategories },
        { key: 'city', label: 'City', type: fieldTypes.select, options: availableCities },
        { key: 'state', label: 'State', type: fieldTypes.select, options: availableStates },
        { key: 'isAvailable', label: 'Available', type: fieldTypes.switch },
    ],
    availableCityAndStates: {

        'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
        'Punjab': ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi'],
        'Balochistan': ['Quetta', 'Gwadar', 'Khuzdar', 'Turbat'],
        'KPK': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat'],
        'Gilgit Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Ghizer']

    }

};

