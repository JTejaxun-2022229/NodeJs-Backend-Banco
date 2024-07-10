import axios from 'axios';

export const convertData = async (req, res) => {

    console.log('convertData')
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    try {
        const { from, to, amount } = req.body;

        if (!from || !to || !amount) {
            return res.status(400).json({ msg: 'Parámetros from, to o amount faltantes.' });
        }

        const url = `${apiUrl}/${apiKey}/pair/${from}/${to}/${amount}`;
        const response = await axios.get(url);

        console.log(url)

        if (response.data && response.data.result === 'success') {
            return res.status(200).json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                convertedAmount: response.data.conversion_result
            });
        } else {
            return res.status(400).json({
                msg: 'Error al convertir la moneda',
                details: response.data
            });
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        return res.status(500).json({ msg: 'Error al realizar la conversión', error: error.message });
    }
};
