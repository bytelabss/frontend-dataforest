import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const removeEmojis = (text: string): string => {
    return text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83D[\uDC00-\uDE4F]|\uFE0F)/g,
        ""
    );
};


const formatDataForPDF = (data: any, parentKey = ""): any[] => {
    const rows: any[] = [];
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const newKey = parentKey ? `${parentKey} > ${key}` : key;

            // Verifica se está dentro de "risks"
            if (parentKey.includes("risks") && typeof data[key] === "object" && data[key] !== null) {
                if (!data[key].hasOwnProperty("valor")){
                    rows.push(...formatDataForPDF(data[key], newKey));
                }
                // Filtra apenas os objetos com "valor = true"
                if (data[key].valor === true) {
                    rows.push({
                        key: `${newKey} > valor`,
                        value: "Sim",
                    })
                    rows.push({
                        key: `${newKey} > explicacao`,
                        value: removeEmojis(data[key].explicacao) || "",
                    });
                    rows.push({
                        key: `${newKey} > recomendacao`,
                        value: removeEmojis(data[key].recomendacao) || "",
                    });
                }
            } else if (typeof data[key] === "object" && data[key] !== null) {
                // Continua a recursão para outros objetos
                rows.push(...formatDataForPDF(data[key], newKey));
            } else {
                // Adiciona outros valores normalmente
                const sanitizedValue =
                    typeof data[key] === "string" ? removeEmojis(data[key]) : data[key];
                rows.push({ key: newKey, value: sanitizedValue });
            }
        }
    }
    return rows;
};

export const exportToPDF = (data: any, filename: string) => {
    const doc = new jsPDF();
    doc.setFontSize(14);

    // Verifica se é um array (relatorio geral) ou um objeto (relatorio individual)
    if (Array.isArray(data)) {
        doc.text(`Relatório Geral`, 90, 10);
        data.forEach((item, index) => {
            // Adiciona espaçamento entre os relatórios
            if (index > 0) {
                doc.addPage();
            }
            doc.text(`Relatório da Área ${item.area.name}`, 20, 20);

            const formattedData = formatDataForPDF(item);
            const tableData = formattedData.map((item) => [item.key, item.value]);

            autoTable(doc, {
                head: [["Campo", "Valor"]],
                body: tableData,
                startY: 30 + index * 10,
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [22, 160, 133] },
            });
        });
    } else {
        doc.text(`Relatório da Área ${data.area.name}`, 10, 10);

        const formattedData = formatDataForPDF(data);

        const tableData = formattedData.map((item) => [item.key, item.value]);

        // Adiciona uma linha extra para o espaçamento
        tableData.unshift(["", ""]);
        autoTable(doc, {
            head: [["Campo", "Valor"]],
            body: tableData,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [22, 160, 133] },
        });
    }

    doc.save(`${filename}.pdf`);
};