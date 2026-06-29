from setuptools import setup, find_packages

setup(
    name="aerocut_ai",
    version="1.0.0",
    description="AeroCut AI by MCR — AI-Orchestrated Video Production Studio",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    author="MCR",
    author_email="266695525+0xmcr@users.noreply.github.com",
    url="https://github.com/0xmcr/AeroCut-AI",
    license="AGPL-3.0",
    packages=find_packages(),
    python_requires=">=3.10",
    install_requires=[
        "pyyaml>=6.0",
        "pydantic>=2.0",
        "jsonschema>=4.20",
        "python-dotenv>=1.0",
        "Pillow>=10.0",
        "requests>=2.31",
    ],
)
