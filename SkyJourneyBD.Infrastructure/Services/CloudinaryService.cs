using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace SkyJourneyBD.Infrastructure.Services;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<(string Url, string PublicId)> UploadImageAsync(
        Stream stream, string fileName, string folder = "skyjourneybd")
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, stream),
            Folder = folder,
            Transformation = new Transformation()
                .Width(1200).Height(800).Crop("limit").Quality("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

        return (result.SecureUrl.ToString(), result.PublicId);
    }
    //
    public async Task<(string Url, string PublicId)> UploadVideoAsync(
    Stream stream, string fileName, string folder = "skyjourneybd/videos")
    {
        var uploadParams = new VideoUploadParams
        {
            File = new FileDescription(fileName, stream),
            Folder = folder,
            Transformation = new Transformation()
                .Quality("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Video upload failed: {result.Error.Message}");

        return (result.SecureUrl.ToString(), result.PublicId);
    }

    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}