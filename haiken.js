"use strict";

window.addEventListener("DOMContentLoaded", () => {
	const e = {};
	document.querySelectorAll("[id]").forEach((elem) => e[elem.id] = elem);

	const LOCAL_STORAGE_KEY = "haiken-5b30163f-f0d8-4f6a-a864-034e44224a29";

	try {
		const data = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (data !== null) {
			const dataDecoded = JSON.parse(data);
			if (dataDecoded) {
				if (typeof dataDecoded.query1 === "string") e.query1.value = dataDecoded.query1;
				if (typeof dataDecoded.query2 === "string") e.query2.value = dataDecoded.query2;
				if (typeof dataDecoded.target === "string") e.target.value = dataDecoded.target;
			}
		}
	} catch (e) {
		console.error(e);
	}

	const matchElement = (s1, s2) => {
		const s1s = s1.split("/");
		const s2s = s2.split("/");
		return s1s.some((e1) => e1 === "*" || s2s.some((e2) => e2 === "*" || e1 === e2));
	};

	const matchArray = (a1, a2) => {
		if (a1.length !== a2.length) return false;
		for (let i = 0; i < a1.length; i++) {
			if (!matchElement(a1[i], a2[i])) return false;
		}
		return true;
	};

	const calc = () => {
		const query1 = e.query1.value === "" ? [] : e.query1.value.split(",");
		const query2 = e.query2.value === "" ? [] : e.query2.value.split(",");
		const arrays = e.target.value.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n").filter((line) => line !== "").map((line) => line.split(","));
		const lastMatch = Array(arrays.length).fill(-1);
		const matches1 = [];
		const matches2 = [];
		const matchMap = Array(arrays.length);
		for (let i = 0; i < matchMap.length; i++) matchMap[i] = `配列${i + 1}：`;
		for (let i = 0; i < arrays.length; i++) {
			const targetArray = arrays[i];
			for (let j = 0; j < targetArray.length; j++) {
				const slice1 = targetArray.slice(j, j + query1.length);
				if (!slice1.every((e) => e === "*") && matchArray(query1, slice1)) {
					matches1.push(`配列${i + 1}の${j + 1}要素目：${slice1.join(",")}`);
					if (lastMatch[i] >= 0) {
						matchMap[i] += `－${j - lastMatch[i]}－`;
					}
					matchMap[i] += "①";
					lastMatch[i] = j;
				}
				const slice2 = targetArray.slice(j, j + query2.length);
				if (!slice2.every((e) => e === "*") && matchArray(query2, slice2)) {
					matches2.push(`配列${i + 1}の${j + 1}要素目：${slice2.join(",")}`);
					if (lastMatch[i] >= 0) {
						matchMap[i] += `－${j - lastMatch[i]}－`;
					}
					matchMap[i] += "②";
					lastMatch[i] = j;
				}
			}
		}
		const finalMatchMap = [];
		for (let i = 0; i < matchMap.length; i++) {
			if (lastMatch[i] >= 0) finalMatchMap.push(matchMap[i]);
		}
		e.result1.textContent = matches1.join("\n");
		e.result2.textContent = matches2.join("\n");
		e.result_map.textContent = finalMatchMap.join("\n");
	};

	const saveAndCalc = () => {
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
				query1: e.query1.value,
				query2: e.query2.value,
				target: e.target.value,
			}));
		} catch (e) {
			console.error(e);
		}
		calc();
	};

	e.query1.addEventListener("input", saveAndCalc);
	e.query2.addEventListener("input", saveAndCalc);
	e.target.addEventListener("input", saveAndCalc);
	calc();
});
