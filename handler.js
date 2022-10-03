"use strict"

const { get } = require("axios").default

class Handler {
	constructor({ rekokSvc, translatorSvc }) {
		this.rekokSvc = rekokSvc
		this.translatorSvc = translatorSvc
	}

	async detectImageLabels(buffer) {
		const result = await this.rekokSvc
			.detectLabels({
				Image: {
					Bytes: buffer,
				},
			})
			.promise()

		const workingItems = result.Labels.filter(
			({ Confidence }) => Confidence > 80
		)

		const names = workingItems.map(({ Name }) => Name).join(" and ")

		return { names, workingItems }
	}

	async translateText(text) {
		const params = {
			SourceLanguageCode: "en",
			TargetLanguageCode: "pt",
			Text: text,
		}

		const { TranslatedText } = await this.translatorSvc
			.translateText(params)
			.promise()

		return TranslatedText.split(" e ")
	}

	async formatTextResults(texts, workingItems) {
		const finalText = []

		for (const indexText in texts) {
			const nameInPortuguese = texts[indexText]
			const confidence = workingItems[indexText].Confidence

			finalText.push(
				`${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
			)
		}

		return finalText.join("\n")
	}

	async getBuffer(imageUrl) {
		const response = await get(imageUrl, {
			responseType: "arraybuffer",
		})

		const buffer = Buffer.from(response.data, "base64")

		return buffer
	}

	async main(event) {
		try {
			const { imageUrl } = event.queryStringParameters

			// const imgBuffer = await readFile("./images/cat-01.jpg")
			const buffer = await this.getBuffer(imageUrl)

			const { names, workingItems } = await this.detectImageLabels(buffer)

			const textInPortuguese = await this.translateText(names)

			const finalText = await this.formatTextResults(
				textInPortuguese,
				workingItems
			)

			return {
				statusCode: 200,
				body: `A imagem tem\n `.concat(finalText),
			}
		} catch (error) {
			console.log("Error***", error.stack)
			return {
				statusCode: 500,
				body: "Internal server error",
			}
		}
	}
}

//factory
const aws = require("aws-sdk")
const reko = new aws.Rekognition()
const translator = new aws.Translate()
const handler = new Handler({
	rekokSvc: reko,
	translatorSvc: translator,
})

module.exports.main = handler.main.bind(handler)
