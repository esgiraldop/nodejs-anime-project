import { promises as fs } from 'fs';

const writeFileMiddleware = async (req, res, next) => {
  const { file, data, newRegister, updated } = res;

  try {
    if (!file || !data) {
      throw new Error('No file path or info to write provided');
    }

    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
    console.log(newRegister);

    res.status(201).send({
      message: 'File written successfully',
      data: newRegister || updated,
    });
  } catch (error) {
    throw error;
  }
};

export default writeFileMiddleware;
