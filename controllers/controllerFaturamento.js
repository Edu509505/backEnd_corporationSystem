import Faturamento from "../models/faturamento.js";

const faturamentoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    idMedicao: z.string().min(1, "Selecione a Medição"),
    valor: z.string().min(1, "Deina um valor"),
    vencimento: z.date("Defina a data para o vencimento"),
    tipo: z.string().min(1, "Selecione o tipo"),
    anexo: z
        .instanceof(File)
        .refine((file) => !!file, "Você deve selecionar ao menos um arquivo")
        .refine((file) => file.size <= 50 * 1024 * 1024, "Arquivo deve ter até 50MB")
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
            "Tipo de arquivo inválido"
        )
});

async function createAnexoVersionamento(req, res) {

    try {
        console.log(req.body)

        const verificacao = await faturamentoSchema.parseAsync(req.body)


        const file = req.file;

        // Caminho do arquivo
        const filePath = path.join(import.meta.dirname, '..', 'temp', file.filename);
        console.log('filePath', filePath);

        // Ler o arquivo
        const fileContent = readFileSync(filePath);

        // Extrair extensão do arquivo
        const extensaoDoArquivo = file.originalname.split('.').reverse()[0];

        // Upload para S3 - cada arquivo com nome único
        const s3Key = `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`;
        const command = new PutObjectCommand({
            Bucket: 'anexo-faturamento',
            Key: s3Key,
            Body: fileContent
        });

        await s3.send(command);

        // Salvar referência no banco para cada arquivo
        await AnexoVersionamento.create({
            idVersionamento: versionamento.id,
            path: s3Key // salva o caminho direto do s3
        });


        const faturamento = await Faturamento.çreate(verificacao)

    } catch {

    }


}