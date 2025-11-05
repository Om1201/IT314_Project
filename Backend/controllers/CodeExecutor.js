import axios from 'axios';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export const executeCode = async (req, res) => {
    try {
        const { language, version, files, args = [], stdin = '' } = req.validatedData;
        const filesArray = files.map(file => ({
            name: file.name,
            content: file.content
        }));

        // Prepare the request payload for Piston API
        const payload = {
            language,
            version,
            files: filesArray,
            args: Array.isArray(args) ? args : [],
            stdin: stdin || '',
        };

        console.log(`Executing code in ${language} ${version}...`);
        console.log(`Main file: ${filesArray[0].name}`);
        if (filesArray.length > 1) {
            console.log(`Linked files: ${filesArray.slice(1).map(f => f.name).join(', ')}`);
        }

        // Make request to Piston API
        const response = await axios.post(PISTON_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        return res.status(200).json({
            success: true,
            data: response.data,
            message: 'Code executed successfully',
        });
    } catch (error) {
        console.error('Error executing code:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
