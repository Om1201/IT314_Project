import axios from 'axios';
import { generateWithGemini } from '../utils/generate.js';
import {getAnalysePrompt} from '../utils/prompt.js';


// const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';
export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",   
  typescript: "5.0.3",      
  python: "3.10.0",
  java: "15.0.2",
  c: "10.2.0",
  cpp: "10.2.0",
  csharp: "6.12.0",
  go: "1.16.2",
  rust: "1.68.2",
  ruby: "3.0.1",
  php: "8.2.3",
  swift: "5.3.3",
  kotlin: "1.8.20",
  r: "4.1.1",               
  scala: "3.2.2",
  perl: "5.36.0",
  haskell: "9.0.1",
  lua: "5.4.4",
  dart: "2.19.6",
  bash: "5.2.0"
};



export const executeCode = async (req, res) => {
    try {
        const { language, files, args = [], stdin = '' } = req.validatedData;
        console.log("asdfafas", language);
        const filesArray = files
            .filter(file => !file.name.endsWith("/")&&(file.language==language))   
            .map(file => ({
                name: file.name.startsWith("/") ? file.name.slice(1) : file.name,
                content: file.code
            }));
        console.log(filesArray);

        const payload = {
            language,
            version : LANGUAGE_VERSIONS[language],
            files: filesArray,
            args: Array.isArray(args) ? args : [],
            stdin: stdin || '',
        };

        console.log(`Executing code in ${language}...`);
        console.log(`Main file: ${filesArray[0].name}`);
        if (filesArray.length > 1) {
            console.log(`Linked files: ${filesArray.slice(1).map(f => f.name).join(', ')}`);
        }

        const response = await axios.post(process.env.PISTON_API_URL, payload, {
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

export const analyse = async (req, res) => {
    try {
        const code = req.body.content;
        const prompt = getAnalysePrompt(code);
        let response = await generateWithGemini(prompt);
        response = response.trim().replace(/^```json\s*|\s*```$/g, '').trim();
        const responseJson = JSON.parse(response);
        return res.status(200).json({
            success: true,
            data : responseJson,
            message : 'Analysis successful'
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};
