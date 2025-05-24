const flattenObject = (obj: any, parentKey = "", result: any = {}) => {
    const removeEmojis = (str: string) => str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parentKey ? `${parentKey}_${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], newKey, result);
            } else {
                if (typeof obj[key] === "boolean") {
                    obj[key] = obj[key] ? "Sim" : "Não";
                }
                if (typeof obj[key] === "string") {
                    obj[key] = removeEmojis(obj[key]);
                }
                console.log(`${result}${newKey} = ${obj[key]}`);
                result[newKey] = obj[key];
            }
        }
    }
    return result;
};

export const exportToCSV = (data: any, filename: string) => {
    let csvContent = "";

    if (Array.isArray(data)) {
        const flattenedData = data.map((item) => flattenObject(item));
        const headers = Array.from(new Set(flattenedData.flatMap((item) => Object.keys(item))));
        csvContent += headers.join(",") + "\n";

        flattenedData.forEach((item) => {
            const row = headers.map((header) => item[header] || "").join(",");
            csvContent += row + "\n";
        });
    } else {
        const flattenedData = flattenObject(data);
        const headers = Object.keys(flattenedData).join(",");
        const values = Object.values(flattenedData).join(",");
        csvContent = `${headers}\n${values}`;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
